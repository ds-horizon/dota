"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const api = require("./api");
const aws_sdk_1 = require("aws-sdk"); // Amazon S3
const aws_sdk_2 = require("aws-sdk");
const azure_storage_1 = require("./storage/azure-storage");
const file_upload_manager_1 = require("./file-upload-manager");
const json_storage_1 = require("./storage/json-storage");
const redis_manager_1 = require("./redis-manager");
const express_rate_limit_1 = require("express-rate-limit");
const config_1 = require("../config");
const config_utils_1 = require("../config-utils");
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "<your-s3-bucket-name>";
const RDS_DB_INSTANCE_IDENTIFIER = process.env.RDS_DB_INSTANCE_IDENTIFIER || "<your-rds-instance>";
const SECRETS_MANAGER_SECRET_ID = process.env.SECRETS_MANAGER_SECRET_ID || "<your-secret-id>";
const s3 = new aws_sdk_1.S3(); // Create an S3 instance
const secretsManager = new aws_sdk_2.SecretsManager(); // Secrets Manager instance for fetching credentials
const bodyParser = require("body-parser");
const domain = require("express-domain-middleware");
const express = require("express");
const csrf = require('lusca').csrf;
const aws_storage_1 = require("./storage/aws-storage");
function bodyParserErrorHandler(err, req, res, next) {
    if (err) {
        if (err.message === "invalid json" || (err.name === "SyntaxError" && ~err.stack.indexOf("body-parser"))) {
            req.body = null;
            next();
        }
        else {
            next(err);
        }
    }
    else {
        next();
    }
}
function start(done, useJsonStorage = false) {
    let storage;
    let isSecretsManagerConfigured;
    let secretValue;
    Promise.resolve((null))
        .then(async () => {
        // Use config layer for storage - initialize based on config.storage.type
        const storageType = config_1.default.storage.type;
        if (storageType === config_utils_1.StorageType.AWS) {
            console.log("Initializing S3Storage");
            storage = new aws_storage_1.S3Storage();
        }
        else if (storageType === config_utils_1.StorageType.AZURE) {
            console.log("Initializing AzureStorage");
            const azureConfig = config_1.default.storage;
            if (azureConfig.type === config_utils_1.StorageType.AZURE) {
                storage = new azure_storage_1.AzureStorage(azureConfig.account, azureConfig.accessKey);
            }
            else {
                throw new Error("Invalid Azure storage configuration");
            }
        }
        else if (storageType === config_utils_1.StorageType.LOCAL) {
            console.log("Initializing JsonStorage");
            storage = new json_storage_1.JsonStorage();
        }
        else {
            throw new Error("Unsupported storage provider configuration");
        }
    })
        .then(() => {
        const app = express();
        const auth = api.auth({ storage: storage });
        // Use config layer for cache
        let redisManager;
        if (config_1.default.cache.type === "redis") {
            console.log("Initializing RedisManager with config type:", config_1.default.cache.type);
            // The RedisManager already reads from env, but you could refactor it to accept config
            redisManager = new redis_manager_1.RedisManager();
        }
        else {
            throw new Error("Unsupported cache provider");
        }
        // First, to wrap all requests and catch all exceptions.
        app.use(domain);
        // Monkey-patch res.send and res.setHeader to no-op after the first call and prevent "already sent" errors.
        app.use((req, res, next) => {
            const originalSend = res.send;
            const originalSetHeader = res.setHeader;
            // req.user = {
            //   id: "default",
            // }
            res.setHeader = (name, value) => {
                if (!res.headersSent) {
                    originalSetHeader.apply(res, [name, value]);
                }
                return {};
            };
            res.send = (body) => {
                if (res.headersSent) {
                    return res;
                }
                return originalSend.apply(res, [body]);
            };
            next();
        });
        if (process.env.LOGGING) {
            app.use((req, res, next) => {
                console.log(); // Newline to mark new request
                console.log(`[REST] Received ${req.method} request at ${req.originalUrl}`);
                next();
            });
        }
        // Enforce a timeout on all requests.
        app.use(api.requestTimeoutHandler());
        // Before other middleware which may use request data that this middleware modifies.
        app.use(api.inputSanitizer());
        //app.use(csrf());
        // body-parser must be before the Application Insights router.
        app.use(bodyParser.urlencoded({ extended: true }));
        const jsonOptions = { limit: "10kb", strict: true };
        if (process.env.LOG_INVALID_JSON_REQUESTS === "true") {
            jsonOptions.verify = (req, res, buf, encoding) => {
                if (buf && buf.length) {
                    req.rawBody = buf.toString();
                }
            };
        }
        app.use(bodyParser.json(jsonOptions));
        // If body-parser throws an error, catch it and set the request body to null.
        app.use(bodyParserErrorHandler);
        // Before all other middleware to ensure all requests are tracked.
        // app.use(appInsights.router());
        app.get("/", (req, res, next) => {
            res.send("Welcome to the CodePush REST API!");
        });
        app.set("etag", false);
        app.set("views", __dirname + "/views");
        app.set("view engine", "ejs");
        app.use("/auth/images/", express.static(__dirname + "/views/images"));
        app.use(api.headers({ origin: process.env.CORS_ORIGIN || "http://localhost:4000" }));
        app.use(api.health({ storage: storage, redisManager: redisManager }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 1000,
            max: 2000,
            validate: { xForwardedForHeader: false }
        });
        if (process.env.DISABLE_ACQUISITION !== "true") {
            app.use(api.acquisition({ storage: storage, redisManager: redisManager }));
        }
        if (process.env.DISABLE_MANAGEMENT !== "true") {
            if (process.env.DEBUG_DISABLE_AUTH === "true") {
                app.use((req, res, next) => {
                    let userId = "default";
                    if (process.env.DEBUG_USER_ID) {
                        userId = process.env.DEBUG_USER_ID;
                    }
                    else {
                        console.log("No DEBUG_USER_ID environment variable configured. Using 'default' as user id");
                    }
                    req.user = {
                        id: userId,
                    };
                    next();
                });
            }
            else {
                app.use(auth.router());
            }
            app.use(auth.authenticate, file_upload_manager_1.fileUploadMiddleware, limiter, api.management({ storage: storage, redisManager: redisManager }));
        }
        else {
            app.use(auth.router());
        }
        done(null, app, storage);
    });
}
exports.start = start;

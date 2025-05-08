"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcquisitionRouter = exports.getHealthRouter = void 0;
const express = require("express");
const semver = require("semver");
const utils = require("../utils/common");
const acquisitionUtils = require("../utils/acquisition");
const errorUtils = require("../utils/rest-error-handling");
const redis = require("../redis-manager");
const restHeaders = require("../utils/rest-headers");
const rolloutSelector = require("../utils/rollout-selector");
const validationUtils = require("../utils/validation");
const queryString = require("querystring");
const URL = require("url");
const tracer_1 = require("../utils/tracer");
const METRICS_BREAKING_VERSION = "1.5.2-beta";
function getUrlKey(originalUrl) {
    const obj = URL.parse(originalUrl, /*parseQueryString*/ true);
    delete obj.query.client_unique_id;
    return obj.pathname + "?" + queryString.stringify(obj.query);
}
function createResponseUsingStorage(req, res, storage) {
    const deploymentKey = String(req.query.deploymentKey || req.query.deployment_key);
    const appVersion = String(req.query.appVersion || req.query.app_version);
    const packageHash = String(req.query.packageHash || req.query.package_hash);
    const isCompanion = String(req.query.isCompanion || req.query.is_companion);
    const updateRequest = {
        deploymentKey: deploymentKey,
        appVersion: appVersion,
        packageHash: packageHash,
        isCompanion: isCompanion && isCompanion.toLowerCase() === "true",
        label: String(req.query.label),
    };
    let originalAppVersion;
    // Make an exception to allow plain integer numbers e.g. "1", "2" etc.
    const isPlainIntegerNumber = /^\d+$/.test(updateRequest.appVersion);
    if (isPlainIntegerNumber) {
        originalAppVersion = updateRequest.appVersion;
        updateRequest.appVersion = originalAppVersion + ".0.0";
    }
    // Make an exception to allow missing patch versions e.g. "2.0" or "2.0-prerelease"
    const isMissingPatchVersion = /^\d+\.\d+([\+\-].*)?$/.test(updateRequest.appVersion);
    if (isMissingPatchVersion) {
        originalAppVersion = updateRequest.appVersion;
        const semverTagIndex = originalAppVersion.search(/[\+\-]/);
        if (semverTagIndex === -1) {
            updateRequest.appVersion += ".0";
        }
        else {
            updateRequest.appVersion = originalAppVersion.slice(0, semverTagIndex) + ".0" + originalAppVersion.slice(semverTagIndex);
        }
    }
    if (validationUtils.isValidUpdateCheckRequest(updateRequest)) {
        return storage.getPackageHistoryFromDeploymentKey(updateRequest.deploymentKey).then((packageHistory) => {
            const updateObject = acquisitionUtils.getUpdatePackageInfo(packageHistory, updateRequest);
            if ((isMissingPatchVersion || isPlainIntegerNumber) && updateObject.originalPackage.appVersion === updateRequest.appVersion) {
                // Set the appVersion of the response to the original one with the missing patch version or plain number
                updateObject.originalPackage.appVersion = originalAppVersion;
                if (updateObject.rolloutPackage) {
                    updateObject.rolloutPackage.appVersion = originalAppVersion;
                }
            }
            const cacheableResponse = {
                statusCode: 200,
                body: updateObject,
            };
            return Promise.resolve(cacheableResponse);
        });
    }
    else {
        if (!validationUtils.isValidKeyField(updateRequest.deploymentKey)) {
            errorUtils.sendMalformedRequestError(res, "An update check must include a valid deployment key - please check that your app has been " +
                "configured correctly. To view available deployment keys, run 'code-push-standalone deployment ls <appName> -k'.");
        }
        else if (!validationUtils.isValidAppVersionField(updateRequest.appVersion)) {
            errorUtils.sendMalformedRequestError(res, "An update check must include a binary version that conforms to the semver standard (e.g. '1.0.0'). " +
                "The binary version is normally inferred from the App Store/Play Store version configured with your app.");
        }
        else {
            errorUtils.sendMalformedRequestError(res, "An update check must include a valid deployment key and provide a semver-compliant app version.");
        }
        return Promise.resolve((null));
    }
}
function getHealthRouter(config) {
    const storage = config.storage;
    const redisManager = config.redisManager;
    const router = express.Router();
    router.get("/healthcheck", (req, res, next) => {
        Promise.any([
            storage.checkHealth(),
            Promise.race([
                redisManager.checkHealth(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout after 30ms")), 30))
            ])
        ])
            .then(() => res.status(200).send("Healthy"))
            .catch((error) => {
            errorUtils.sendUnknownError(res, error, next);
            (0, tracer_1.sendErrorToDatadog)(error);
        });
    });
    return router;
}
exports.getHealthRouter = getHealthRouter;
function getAcquisitionRouter(config) {
    const storage = config.storage;
    const redisManager = config.redisManager;
    const router = express.Router();
    const REDIS_TIMEOUT = 100;
    const REDIS_TIMEOUT_MS = parseInt(process.env.REDIS_TIMEOUT) || REDIS_TIMEOUT;
    function redisWithTimeout(redisPromise) {
        return Promise.race([
            redisPromise,
            new Promise((_resolve, reject) => {
                setTimeout(() => reject(new Error("Redis request timed out. Redis might be down")), REDIS_TIMEOUT_MS);
            }),
        ]);
    }
    const updateCheck = function (newApi) {
        return function (req, res, next) {
            const deploymentKey = String(req.query.deploymentKey || req.query.deployment_key);
            const key = redis.Utilities.getDeploymentKeyHash(deploymentKey);
            const clientUniqueId = String(req.query.clientUniqueId || req.query.client_unique_id);
            const url = getUrlKey(req.originalUrl);
            let fromCache = true;
            let redisError = null;
            redisWithTimeout(redisManager.getCachedResponse(key, url))
                .catch((error) => {
                // If Redis is down/slow, we store the error for logging but return null
                // so we can continue with DB lookups.
                redisError = error;
                return null; // triggers fallback to DB
            })
                .then((cachedResponse) => {
                fromCache = !!cachedResponse;
                // If we got nothing from Redis, we use the DB storage approach.
                return cachedResponse || createResponseUsingStorage(req, res, storage);
            })
                .then((response) => {
                if (!response) {
                    // If we still have no response, something else has gone wrong.
                    // Possibly return next() with an error or handle differently.
                    return Promise.resolve();
                }
                const cachedResponseObject = response.body;
                let giveRolloutPackage = false;
                // Decide if we should serve the "rolloutPackage" or the original package
                if (cachedResponseObject.rolloutPackage && clientUniqueId) {
                    const releaseSpecificString = cachedResponseObject.rolloutPackage.label ||
                        cachedResponseObject.rolloutPackage.packageHash;
                    giveRolloutPackage = rolloutSelector.isSelectedForRollout(clientUniqueId, cachedResponseObject.rollout, releaseSpecificString);
                }
                const updateCheckBody = {
                    updateInfo: giveRolloutPackage
                        ? cachedResponseObject.rolloutPackage
                        : cachedResponseObject.originalPackage,
                };
                // In the new API, we overwrite "target_binary_range"
                updateCheckBody.updateInfo.target_binary_range = updateCheckBody.updateInfo.appVersion;
                // Send the final response
                res.locals.fromCache = fromCache;
                res
                    .status(response.statusCode)
                    .send(newApi ? utils.convertObjectToSnakeCase(updateCheckBody) : updateCheckBody);
                // Update Redis cache AFTER sending response, if we didn't have a cache hit
                if (!fromCache) {
                    redisManager.setCachedResponse(key, url, response).catch((err) => {
                        // Log the error, but don’t block the request (which is already done).
                        console.error("Failed while setting cached response in Redis:", err);
                        (0, tracer_1.sendErrorToDatadog)(err);
                    });
                }
            })
                .then(() => {
                // If there was a Redis error, log it (e.g., to Datadog) and optionally throw
                if (redisError) {
                    (0, tracer_1.sendErrorToDatadog)(redisError);
                    console.error("Redis error:", redisError);
                }
            })
                .catch((error) => {
                // If DB storage also failed or some other error
                errorUtils.restErrorHandler(res, error, next);
            });
        };
    };
    const reportStatusDeploy = function (req, res, next) {
        const deploymentKey = req.body.deploymentKey || req.body.deployment_key;
        const appVersion = req.body.appVersion || req.body.app_version;
        const previousDeploymentKey = req.body.previousDeploymentKey || req.body.previous_deployment_key || deploymentKey;
        const previousLabelOrAppVersion = req.body.previousLabelOrAppVersion || req.body.previous_label_or_app_version;
        const clientUniqueId = req.body.clientUniqueId || req.body.client_unique_id;
        if (!deploymentKey || !appVersion) {
            return errorUtils.sendMalformedRequestError(res, "A deploy status report must contain a valid appVersion and deploymentKey.");
        }
        else if (req.body.label) {
            if (!req.body.status) {
                return errorUtils.sendMalformedRequestError(res, "A deploy status report for a labelled package must contain a valid status.");
            }
            else if (!redis.Utilities.isValidDeploymentStatus(req.body.status)) {
                return errorUtils.sendMalformedRequestError(res, "Invalid status: " + req.body.status);
            }
        }
        const rawSdkVersion = restHeaders.getSdkVersion(req);
        const sdkVersion = rawSdkVersion ? rawSdkVersion.replace(/[^0-9.]/g, '') : null;
        if (semver.valid(sdkVersion) && semver.gte(sdkVersion, METRICS_BREAKING_VERSION)) {
            // If previousDeploymentKey not provided, assume it is the same deployment key.
            let redisUpdatePromise;
            if (req.body.label && req.body.status === redis.DEPLOYMENT_FAILED) {
                redisUpdatePromise =
                    redisWithTimeout(redisManager.incrementLabelStatusCount(deploymentKey, req.body.label, req.body.status));
            }
            else {
                const labelOrAppVersion = req.body.label || appVersion;
                redisUpdatePromise =
                    redisWithTimeout(redisManager.recordUpdate(deploymentKey, labelOrAppVersion, previousDeploymentKey, previousLabelOrAppVersion));
            }
            redisUpdatePromise
                .then(() => {
                res.sendStatus(200);
                if (clientUniqueId) {
                    // This cleanup call is fire-and-forget; errors are logged but don't affect the response.
                    redisWithTimeout(redisManager.removeDeploymentKeyClientActiveLabel(previousDeploymentKey, clientUniqueId)).catch((err) => {
                        (0, tracer_1.sendErrorToDatadog)(err);
                        console.error("Error or timeout on removeDeploymentKeyClientActiveLabel:", err);
                    });
                }
            })
                .catch((error) => {
                errorUtils.sendUnknownError(res, error, next);
                (0, tracer_1.sendErrorToDatadog)(error);
            });
        }
        else {
            if (!clientUniqueId) {
                return errorUtils.sendMalformedRequestError(res, "A deploy status report must contain a valid appVersion, clientUniqueId and deploymentKey.");
            }
            redisWithTimeout(redisManager.getCurrentActiveLabel(deploymentKey, clientUniqueId))
                .then((currentVersionLabel) => {
                if (req.body.label && req.body.label !== currentVersionLabel) {
                    return redisWithTimeout(redisManager.incrementLabelStatusCount(deploymentKey, req.body.label, req.body.status)).then(() => {
                        if (req.body.status === redis.DEPLOYMENT_SUCCEEDED) {
                            return redisWithTimeout(redisManager.updateActiveAppForClient(deploymentKey, clientUniqueId, req.body.label, currentVersionLabel));
                        }
                    });
                }
                else if (!req.body.label && appVersion !== currentVersionLabel) {
                    return redisWithTimeout(redisManager.updateActiveAppForClient(deploymentKey, clientUniqueId, appVersion, appVersion));
                }
            })
                .then(() => {
                res.sendStatus(200);
            })
                .catch((error) => {
                errorUtils.sendUnknownError(res, error, next);
                (0, tracer_1.sendErrorToDatadog)(error);
            });
        }
    };
    const reportStatusDownload = function (req, res, next) {
        const deploymentKey = req.body.deploymentKey || req.body.deployment_key;
        if (!req.body || !deploymentKey || !req.body.label) {
            return errorUtils.sendMalformedRequestError(res, "A download status report must contain a valid deploymentKey and package label.");
        }
        return redisWithTimeout(redisManager
            .incrementLabelStatusCount(deploymentKey, req.body.label, redis.DOWNLOADED)).then(() => {
            res.sendStatus(200);
        })
            .catch((error) => errorUtils.sendUnknownError(res, error, next));
    };
    router.get("/updateCheck", updateCheck(false));
    router.get("/v0.1/public/codepush/update_check", updateCheck(true));
    router.post("/reportStatus/deploy", reportStatusDeploy);
    router.post("/v0.1/public/codepush/report_status/deploy", reportStatusDeploy);
    router.post("/reportStatus/download", reportStatusDownload);
    router.post("/v0.1/public/codepush/report_status/download", reportStatusDownload);
    return router;
}
exports.getAcquisitionRouter = getAcquisitionRouter;

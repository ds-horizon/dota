"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_utils_1 = require("./config-utils");
// Determine which storage provider to use based on environment variables
function getStorageConfig() {
    const storageProvider = process.env.STORAGE_PROVIDER || "local";
    switch (storageProvider.toLowerCase()) {
        case "azure":
            if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
                return {
                    type: config_utils_1.StorageType.AZURE,
                    account: process.env.AZURE_STORAGE_ACCOUNT,
                    accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
                };
            }
            console.warn("Azure storage environment variables missing, falling back to local storage");
            return { type: config_utils_1.StorageType.LOCAL };
        case "aws":
            if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
                return {
                    type: config_utils_1.StorageType.AWS,
                    bucketName: process.env.S3_BUCKET_NAME,
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                };
            }
            console.warn("AWS storage environment variables missing, falling back to local storage");
            return { type: config_utils_1.StorageType.LOCAL };
        case "local":
        default:
            return {
                type: config_utils_1.StorageType.LOCAL,
                path: process.env.LOCAL_STORAGE_PATH
            };
    }
}
const config = (0, config_utils_1.defineConfig)({
    storage: getStorageConfig(),
    cache: {
        type: "redis",
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || "6379",
    }
});
exports.default = config;

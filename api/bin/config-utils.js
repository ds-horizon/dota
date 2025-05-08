"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfig = exports.StorageType = void 0;
var StorageType;
(function (StorageType) {
    StorageType["AWS"] = "aws";
    StorageType["AZURE"] = "azure";
    StorageType["LOCAL"] = "local";
})(StorageType || (exports.StorageType = StorageType = {}));
function defineConfig(config) {
    return config;
}
exports.defineConfig = defineConfig;

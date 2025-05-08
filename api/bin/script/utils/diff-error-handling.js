"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.diffErrorHandler = exports.diffError = exports.ErrorCode = void 0;
const errorModule = require("../error");
const storageTypes = require("../storage/storage");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["InvalidArguments"] = 0] = "InvalidArguments";
    ErrorCode[ErrorCode["ConnectionFailed"] = 1] = "ConnectionFailed";
    ErrorCode[ErrorCode["ProcessingFailed"] = 2] = "ProcessingFailed";
    ErrorCode[ErrorCode["Other"] = 99] = "Other";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
function diffError(errorCode, message) {
    const diffError = errorModule.codePushError(errorModule.ErrorSource.Diffing, message);
    diffError.code = errorCode;
    return diffError;
}
exports.diffError = diffError;
function diffErrorHandler(error) {
    if (error.source === errorModule.ErrorSource.Storage) {
        let handledError;
        switch (error.code) {
            case storageTypes.ErrorCode.NotFound:
                handledError = diffError(ErrorCode.ProcessingFailed, "Unable to fetch data from storage, not found");
                break;
            case storageTypes.ErrorCode.ConnectionFailed:
                handledError = diffError(ErrorCode.ConnectionFailed, "Error retrieving data from storage, connection failed.");
                break;
            default:
                handledError = diffError(ErrorCode.Other, error.message || "Unknown error");
                break;
        }
        throw handledError;
    }
    else {
        throw error;
    }
}
exports.diffErrorHandler = diffErrorHandler;

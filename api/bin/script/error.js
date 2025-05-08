"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codePushError = exports.ErrorSource = void 0;
var ErrorSource;
(function (ErrorSource) {
    ErrorSource[ErrorSource["Storage"] = 0] = "Storage";
    ErrorSource[ErrorSource["Rest"] = 1] = "Rest";
    ErrorSource[ErrorSource["Diffing"] = 2] = "Diffing";
})(ErrorSource || (exports.ErrorSource = ErrorSource = {}));
function codePushError(source, message) {
    const error = new Error(message);
    error.source = source;
    return error;
}
exports.codePushError = codePushError;

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUnknownError = exports.sendConnectionFailedError = exports.sendTooLargeError = exports.sendResourceGonePage = exports.sendResourceGoneError = exports.sendAlreadyExistsPage = exports.sendConflictError = exports.sendNotRegisteredError = exports.sendNotFoundError = exports.sendForbiddenPage = exports.sendForbiddenError = exports.sendMalformedRequestError = exports.restErrorHandler = exports.restError = exports.ErrorCode = void 0;
const errorModule = require("../error");
const storageTypes = require("../storage/storage");
const passportAuthentication = require("../routes/passport-authentication");
const app_insights_1 = require("../routes/app-insights");
const tracer_1 = require("./tracer");
const sanitizeHtml = require("sanitize-html");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Conflict"] = 0] = "Conflict";
    ErrorCode[ErrorCode["MalformedRequest"] = 1] = "MalformedRequest";
    ErrorCode[ErrorCode["NotFound"] = 2] = "NotFound";
    ErrorCode[ErrorCode["Unauthorized"] = 4] = "Unauthorized";
    ErrorCode[ErrorCode["Other"] = 99] = "Other";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
function restError(errorCode, message) {
    const restError = errorModule.codePushError(errorModule.ErrorSource.Rest, message);
    restError.code = errorCode;
    return restError;
}
exports.restError = restError;
function restErrorHandler(res, error, next) {
    if (!error || (error.source !== errorModule.ErrorSource.Storage && error.source !== errorModule.ErrorSource.Rest)) {
        console.log("Unknown error source");
        sendUnknownError(res, error, next);
    }
    else if (error.source === errorModule.ErrorSource.Storage) {
        storageErrorHandler(res, error, next);
    }
    else {
        const restError = error;
        switch (restError.code) {
            case ErrorCode.Conflict:
                sendConflictError(res, error.message);
                break;
            case ErrorCode.MalformedRequest:
                sendMalformedRequestError(res, error.message);
                break;
            case ErrorCode.NotFound:
                sendNotFoundError(res, error.message);
                break;
            case ErrorCode.Unauthorized:
                sendForbiddenError(res, error.message);
                break;
            default:
                console.log("Unknown REST error");
                sendUnknownError(res, error, next);
                break;
        }
    }
}
exports.restErrorHandler = restErrorHandler;
function sendMalformedRequestError(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("400: Malformed Request error " + message));
    if (message) {
        res.status(400).send(sanitizeHtml(message));
    }
    else {
        res.sendStatus(400);
    }
}
exports.sendMalformedRequestError = sendMalformedRequestError;
function sendForbiddenError(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("403: Forbidden error " + message));
    if (message) {
        res.status(403).send(sanitizeHtml(message));
    }
    else {
        res.sendStatus(403);
    }
}
exports.sendForbiddenError = sendForbiddenError;
function sendForbiddenPage(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("403: Forbidden Page error " + message));
    res.status(403).render("message", { message: message });
}
exports.sendForbiddenPage = sendForbiddenPage;
function sendNotFoundError(res, message) {
    if (message) {
        (0, tracer_1.sendErrorToDatadog)(new Error("404: Not found error " + sanitizeHtml(message)));
        res.status(404).send(sanitizeHtml(message));
    }
    else {
        (0, tracer_1.sendErrorToDatadog)(new Error("404: Not found error"));
        res.sendStatus(404);
    }
}
exports.sendNotFoundError = sendNotFoundError;
function sendNotRegisteredError(res) {
    if (passportAuthentication.PassportAuthentication.isAccountRegistrationEnabled()) {
        (0, tracer_1.sendErrorToDatadog)(new Error("403: Account not found"));
        res.status(403).render("message", {
            message: "Account not found.<br/>Have you registered with the CLI?<br/>If you are registered but your email address has changed, please contact us.",
        });
    }
    else {
        (0, tracer_1.sendErrorToDatadog)(new Error("403: Account not found"));
        res.status(403).render("message", {
            message: "Account not found.<br/>Please <a href='http://microsoft.github.io/code-push/'>sign up for the beta</a>, and we will contact you when your account has been created!</a>",
        });
    }
}
exports.sendNotRegisteredError = sendNotRegisteredError;
function sendConflictError(res, message) {
    message = message ? sanitizeHtml(message) : "The provided resource already exists";
    (0, tracer_1.sendErrorToDatadog)(new Error("409: Conflict error " + message));
    res.status(409).send(message);
}
exports.sendConflictError = sendConflictError;
function sendAlreadyExistsPage(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("409: Already Exists error " + message));
    res.status(409).render("message", { message: message });
}
exports.sendAlreadyExistsPage = sendAlreadyExistsPage;
function sendResourceGoneError(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("410: Resource Gone error " + message));
    res.status(410).send(sanitizeHtml(message));
}
exports.sendResourceGoneError = sendResourceGoneError;
function sendResourceGonePage(res, message) {
    (0, tracer_1.sendErrorToDatadog)(new Error("410: Resource Gone error " + message));
    res.status(410).render("message", { message: message });
}
exports.sendResourceGonePage = sendResourceGonePage;
function sendTooLargeError(res) {
    (0, tracer_1.sendErrorToDatadog)(new Error("413: The provided resource is too large"));
    res.status(413).send("The provided resource is too large");
}
exports.sendTooLargeError = sendTooLargeError;
function sendConnectionFailedError(res) {
    (0, tracer_1.sendErrorToDatadog)(new Error("503: Connection failed"));
    res.status(503).send("The CodePush server temporarily timed out. Please try again.");
}
exports.sendConnectionFailedError = sendConnectionFailedError;
function sendUnknownError(res, error, next) {
    error = error || new Error("Unknown error");
    if (typeof error["stack"] === "string") {
        console.log(error["stack"]);
        (0, tracer_1.sendErrorToDatadog)(new Error("500: Unknown error " + error["stack"]));
    }
    else {
        console.log(error);
        (0, tracer_1.sendErrorToDatadog)(new Error("500: Unknown error " + error));
    }
    if (app_insights_1.AppInsights.isAppInsightsInstrumented()) {
        next(error); // Log error with AppInsights.
    }
    else {
        res.sendStatus(500);
    }
}
exports.sendUnknownError = sendUnknownError;
function storageErrorHandler(res, error, next) {
    switch (error.code) {
        case storageTypes.ErrorCode.NotFound:
            sendNotFoundError(res, error.message);
            break;
        case storageTypes.ErrorCode.AlreadyExists:
            sendConflictError(res, error.message);
            break;
        case storageTypes.ErrorCode.TooLarge:
            sendTooLargeError(res);
            break;
        case storageTypes.ErrorCode.ConnectionFailed:
            sendConnectionFailedError(res);
            break;
        case storageTypes.ErrorCode.Invalid:
            sendMalformedRequestError(res, error.message);
            break;
        case storageTypes.ErrorCode.Other:
        default:
            console.log("Unknown storage error.");
            sendUnknownError(res, error, next);
            break;
    }
}

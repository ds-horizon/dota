"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeoutHandler = exports.inputSanitizer = exports.appInsights = exports.auth = exports.management = exports.health = exports.acquisition = exports.headers = void 0;
const headers_1 = require("./routes/headers");
const acquisition_1 = require("./routes/acquisition");
const management_1 = require("./routes/management");
const passport_authentication_1 = require("./routes/passport-authentication");
const authentication_1 = require("./routes/authentication");
const app_insights_1 = require("./routes/app-insights");
const input_sanitizer_1 = require("./routes/input-sanitizer");
const request_timeout_1 = require("./routes/request-timeout");
function headers(config) {
    return (0, headers_1.getHeadersMiddleware)(config);
}
exports.headers = headers;
function acquisition(config) {
    return (0, acquisition_1.getAcquisitionRouter)(config);
}
exports.acquisition = acquisition;
function health(config) {
    return (0, acquisition_1.getHealthRouter)(config);
}
exports.health = health;
function management(config) {
    return (0, management_1.getManagementRouter)(config);
}
exports.management = management;
function auth(config) {
    const passportAuthentication = new passport_authentication_1.PassportAuthentication(config);
    const authentication = new authentication_1.Authentication(config);
    return {
        router: authentication.getRouter.bind(authentication),
        authenticate: authentication.authenticate.bind(authentication),
    };
}
exports.auth = auth;
function appInsights() {
    const appInsights = new app_insights_1.AppInsights();
    return {
        router: appInsights.getRouter.bind(appInsights),
        errorHandler: appInsights.errorHandler.bind(appInsights),
    };
}
exports.appInsights = appInsights;
function inputSanitizer() {
    return input_sanitizer_1.InputSanitizer;
}
exports.inputSanitizer = inputSanitizer;
function requestTimeoutHandler() {
    return request_timeout_1.RequestTimeoutHandler;
}
exports.requestTimeoutHandler = requestTimeoutHandler;

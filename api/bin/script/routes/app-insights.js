"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInsights = void 0;
const express = require("express");
const restHeaders = require("../utils/rest-headers");
const ApplicationInsights = require("applicationinsights");
const tryJSON = require("try-json");
var ServiceResource;
(function (ServiceResource) {
    ServiceResource[ServiceResource["AccessKeys"] = 0] = "AccessKeys";
    ServiceResource[ServiceResource["AccessKeysWithId"] = 1] = "AccessKeysWithId";
    ServiceResource[ServiceResource["Account"] = 2] = "Account";
    ServiceResource[ServiceResource["AppTransfer"] = 3] = "AppTransfer";
    ServiceResource[ServiceResource["Apps"] = 4] = "Apps";
    ServiceResource[ServiceResource["AppsWithId"] = 5] = "AppsWithId";
    ServiceResource[ServiceResource["Collaborators"] = 6] = "Collaborators";
    ServiceResource[ServiceResource["CollaboratorsWithEmail"] = 7] = "CollaboratorsWithEmail";
    ServiceResource[ServiceResource["DeploymentHistory"] = 8] = "DeploymentHistory";
    ServiceResource[ServiceResource["Deployments"] = 9] = "Deployments";
    ServiceResource[ServiceResource["DeploymentsWithId"] = 10] = "DeploymentsWithId";
    ServiceResource[ServiceResource["LinkGitHub"] = 11] = "LinkGitHub";
    ServiceResource[ServiceResource["LinkMicrosoft"] = 12] = "LinkMicrosoft";
    ServiceResource[ServiceResource["LoginGitHub"] = 13] = "LoginGitHub";
    ServiceResource[ServiceResource["LoginMicrosoft"] = 14] = "LoginMicrosoft";
    ServiceResource[ServiceResource["Metrics"] = 15] = "Metrics";
    ServiceResource[ServiceResource["Other"] = 16] = "Other";
    ServiceResource[ServiceResource["Promote"] = 17] = "Promote";
    ServiceResource[ServiceResource["RegisterGitHub"] = 18] = "RegisterGitHub";
    ServiceResource[ServiceResource["RegisterMicrosoft"] = 19] = "RegisterMicrosoft";
    ServiceResource[ServiceResource["Release"] = 20] = "Release";
    ServiceResource[ServiceResource["ReportStatusDeploy"] = 21] = "ReportStatusDeploy";
    ServiceResource[ServiceResource["ReportStatusDownload"] = 22] = "ReportStatusDownload";
    ServiceResource[ServiceResource["Rollback"] = 23] = "Rollback";
    ServiceResource[ServiceResource["UpdateCheck"] = 24] = "UpdateCheck";
})(ServiceResource || (ServiceResource = {}));
const INSTRUMENTATION_KEY = process.env["APP_INSIGHTS_INSTRUMENTATION_KEY"];
class AppInsights {
    static ORIGIN_TAG = "Origin";
    static ORIGIN_VERSION_TAG = "Origin version";
    static SERVICE_RESOURCE_DEFINITIONS = [
        // /accessKeys
        { resource: ServiceResource.AccessKeys, regExp: /^\/accessKeys[\/]?$/i, tag: "AccessKeys" },
        // /accessKeys/def123
        { resource: ServiceResource.AccessKeysWithId, regExp: /^\/accessKeys\/[^\/]+[\/]?$/i, tag: "AccessKey" },
        // /account
        { resource: ServiceResource.Account, regExp: /^\/account[\/]?$/i, tag: "Account" },
        // /apps/abc123/transfer/foo@bar.com
        { resource: ServiceResource.AppTransfer, regExp: /^\/apps\/[^\/]+\/transfer\/[^\/]+[\/]?$/i, tag: "App transfer" },
        // /apps
        { resource: ServiceResource.Apps, regExp: /^\/apps[\/]?$/i, tag: "Apps" },
        // /apps/abc123
        { resource: ServiceResource.AppsWithId, regExp: /^\/apps\/[^\/]+[\/]?$/i, tag: "App" },
        // /apps/abc123/collaborators
        { resource: ServiceResource.Collaborators, regExp: /^\/apps\/[^\/]+\/collaborators[\/]?$/i, tag: "Collaborators" },
        // /apps/abc123/collaborators/foo@bar.com
        { resource: ServiceResource.CollaboratorsWithEmail, regExp: /^\/apps\/[^\/]+\/collaborators\/[^\/]+[\/]?$/i, tag: "Collaborator" },
        // /apps/abc123/deployments/xyz123/history
        {
            resource: ServiceResource.DeploymentHistory,
            regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+\/history[\/]?$/i,
            tag: "DeploymentHistory",
        },
        // /apps/abc123/deployments
        { resource: ServiceResource.Deployments, regExp: /^\/apps\/[^\/]+\/deployments[\/]?$/i, tag: "Deployments" },
        // /apps/abc123/deployments/xyz123
        { resource: ServiceResource.DeploymentsWithId, regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+[\/]?$/i, tag: "Deployment" },
        // /auth/link/github
        { resource: ServiceResource.LinkGitHub, regExp: /^\/auth\/link\/github[\/]?/i, tag: "Link GitHub account" },
        // /auth/link/microsoft
        { resource: ServiceResource.LinkMicrosoft, regExp: /^\/auth\/link\/microsoft[\/]?/i, tag: "Link Microsoft account" },
        // /auth/login/github
        { resource: ServiceResource.LoginGitHub, regExp: /^\/auth\/login\/github[\/]?/i, tag: "Login with GitHub" },
        // /auth/login/microsoft
        { resource: ServiceResource.LoginMicrosoft, regExp: /^\/auth\/login\/microsoft[\/]?/i, tag: "Login with Microsoft" },
        // /apps/abc123/deployments/xyz123/metrics
        { resource: ServiceResource.Metrics, regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+\/metrics[\/]?$/i, tag: "Deployment Metrics" },
        // /apps/abc123/deployments/xyz123/promote/def123
        { resource: ServiceResource.Promote, regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+\/promote\/[^\/]+[\/]?$/i, tag: "Package" },
        // /auth/register/github
        { resource: ServiceResource.RegisterGitHub, regExp: /^\/auth\/register\/github[\/]?/i, tag: "Register with GitHub" },
        // /auth/register/microsoft
        { resource: ServiceResource.RegisterMicrosoft, regExp: /^\/auth\/register\/microsoft[\/]?/i, tag: "Register with Microsoft" },
        // /apps/abc123/deployments/xyz123/release
        { resource: ServiceResource.Release, regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+\/release[\/]?$/i, tag: "Package" },
        // /reportStatus/deploy or /reportStatus/deploy/
        { resource: ServiceResource.ReportStatusDeploy, regExp: /^\/reportStatus\/deploy[\/]?$/i, tag: "ReportStatusDeploy" },
        // /reportStatus/download or /reportStatus/download/
        { resource: ServiceResource.ReportStatusDownload, regExp: /^\/reportStatus\/download[\/]?$/i, tag: "ReportStatusDownload" },
        // /apps/abc123/deployments/xyz123/rollback or /apps/abc123/deployments/xyz123/rollback/v4
        { resource: ServiceResource.Rollback, regExp: /^\/apps\/[^\/]+\/deployments\/[^\/]+\/rollback(\/[^\/]+)?[\/]?$/i, tag: "Package" },
        // starts with /updateCheck
        { resource: ServiceResource.UpdateCheck, regExp: /^\/updateCheck/i, tag: "UpdateCheck" },
    ];
    constructor() {
        if (INSTRUMENTATION_KEY) {
            ApplicationInsights.setup(INSTRUMENTATION_KEY)
                .setAutoCollectRequests(false)
                .setAutoCollectPerformance(false)
                .setAutoCollectExceptions(true)
                .start();
        }
    }
    static isAppInsightsInstrumented() {
        return !!INSTRUMENTATION_KEY;
    }
    errorHandler(err, req, res, next) {
        if (err && INSTRUMENTATION_KEY) {
            if (!req) {
                this.trackException(err);
                return;
            }
            this.trackException(err, {
                URL: req.originalUrl,
                Request: JSON.stringify(req, [
                    "cookies",
                    "fresh",
                    "ip",
                    "method",
                    "originalUrl",
                    "protocol",
                    "rawHeaders",
                    "sessionID",
                    "signedCookies",
                    "url",
                    "xhr",
                ]),
                Response: JSON.stringify(res, ["headersSent", "locals", "fromCache"]),
                Error: JSON.stringify(err.message),
            });
            if (!res.headersSent) {
                res.sendStatus(500);
            }
        }
        else if (!!next) {
            next(err);
        }
    }
    getRouter() {
        const router = express.Router();
        router.use((req, res, next) => {
            const reqStart = new Date().getTime();
            // If the application insights has not been instrumented, short circuit to next middleware.
            const isHealthCheck = req.url === "/health";
            if (!INSTRUMENTATION_KEY || isHealthCheck) {
                next();
                return;
            }
            const url = req.url;
            const method = req.method;
            const tagProperties = {};
            tagProperties["Request name"] = method + " " + url;
            const resource = this.getServiceResource(url);
            const property = this.getTagProperty(method, url, res.statusCode, resource);
            if (property) {
                tagProperties["Analytics"] = property;
                const isUpdateCheck = property === this.getTag(ServiceResource.UpdateCheck);
                if (isUpdateCheck) {
                    const key = String(req.query.deploymentKey || req.params.deploymentKey);
                    if (key) {
                        tagProperties["Update check for key"] = key;
                    }
                }
                else if (property === this.getTag(ServiceResource.ReportStatusDeploy)) {
                    if (req.body) {
                        const deploymentKey = req.body.deploymentKey;
                        const status = req.body.status;
                        if (deploymentKey && status) {
                            this.reportStatus(tagProperties, status, deploymentKey);
                        }
                    }
                }
                else if (property === this.getTag(ServiceResource.ReportStatusDownload)) {
                    if (req.body) {
                        const deploymentKey = req.body.deploymentKey;
                        if (deploymentKey) {
                            this.reportStatus(tagProperties, "Downloaded", deploymentKey);
                        }
                    }
                }
                else if (resource === ServiceResource.Release || resource === ServiceResource.Promote) {
                    if (req.body) {
                        const info = tryJSON(req.body.packageInfo) || req.body.packageInfo;
                        if (info && info.rollout) {
                            let value;
                            switch (method) {
                                case "POST":
                                    value = info.rollout === 100 ? null : "Released";
                                    break;
                                case "PATCH":
                                    value = "Bumped";
                                    break;
                            }
                            if (value) {
                                tagProperties["Rollout"] = value;
                            }
                        }
                    }
                }
            }
            if (restHeaders.getCliVersion(req)) {
                tagProperties[AppInsights.ORIGIN_TAG] = "code-push-cli";
                tagProperties[AppInsights.ORIGIN_VERSION_TAG] = restHeaders.getCliVersion(req);
            }
            else if (restHeaders.getSdkVersion(req)) {
                tagProperties[AppInsights.ORIGIN_TAG] = "code-push";
                tagProperties[AppInsights.ORIGIN_VERSION_TAG] = restHeaders.getSdkVersion(req);
            }
            else {
                tagProperties[AppInsights.ORIGIN_TAG] = "Unknown";
            }
            ApplicationInsights.defaultClient.trackRequest({
                name: req.path,
                url: req.originalUrl,
                duration: new Date().getTime() - reqStart,
                resultCode: res.statusCode,
                success: res.statusCode >= 200 && res.statusCode <= 299,
            });
            if (res && res.once) {
                res.once("finish", () => {
                    let eventProperties;
                    if (req.user && req.user.id) {
                        eventProperties = { url: req.url, method: req.method, statusCode: res.statusCode.toString() };
                        if (req.url.startsWith("/auth/callback")) {
                            eventProperties.providerId = req.user.id;
                        }
                        else {
                            eventProperties.userId = req.user.id;
                        }
                        // Contains information like appName or deploymentName, depending on the route
                        if (req.params) {
                            for (const paramName in req.params) {
                                if (req.params.hasOwnProperty(paramName)) {
                                    eventProperties[paramName] = req.params[paramName];
                                }
                            }
                        }
                        this.trackEvent("User activity", eventProperties);
                    }
                    if (res.statusCode >= 400) {
                        eventProperties = { url: req.url, method: req.method, statusCode: res.statusCode.toString() };
                        if (property) {
                            eventProperties.tag = property;
                        }
                        if (process.env.LOG_INVALID_JSON_REQUESTS === "true") {
                            eventProperties.rawBody = req.rawBody;
                        }
                        this.trackEvent("Error response", eventProperties);
                    }
                });
            }
            next();
        });
        return router;
    }
    trackEvent(event, properties) {
        if (AppInsights.isAppInsightsInstrumented) {
            ApplicationInsights.defaultClient.trackEvent({ name: event, properties });
        }
    }
    trackException(err, info) {
        if (err && AppInsights.isAppInsightsInstrumented) {
            ApplicationInsights.defaultClient.trackException({ exception: err, measurements: info });
        }
    }
    getTagProperty(method, url, statusCode, resource) {
        if (!statusCode) {
            return null;
        }
        const tag = this.getTag(resource);
        if (!tag) {
            return null;
        }
        let property = "";
        if (tag.indexOf("Link") < 0 && tag.indexOf("Login") < 0 && tag.indexOf("Logout") < 0 && tag.indexOf("Register") < 0) {
            switch (method) {
                case "GET":
                    if (resource !== ServiceResource.UpdateCheck) {
                        property += "Get";
                    }
                    break;
                case "POST":
                    switch (resource) {
                        case ServiceResource.AppTransfer:
                            break;
                        case ServiceResource.CollaboratorsWithEmail:
                            property += "Added";
                            break;
                        case ServiceResource.Promote:
                            property += "Promoted";
                            break;
                        case ServiceResource.Release:
                            property += "Released";
                            break;
                        case ServiceResource.ReportStatusDeploy:
                        case ServiceResource.ReportStatusDownload:
                            break;
                        case ServiceResource.Rollback:
                            property += "Rolled Back";
                            break;
                        default:
                            property += "Created";
                            break;
                    }
                    break;
                case "PATCH":
                    property += "Modified";
                    break;
                case "DELETE":
                    switch (resource) {
                        case ServiceResource.CollaboratorsWithEmail:
                            property += "Removed";
                            break;
                        default:
                            property += "Deleted";
                            break;
                    }
                    break;
                default:
                    return null;
            }
        }
        if (statusCode >= 400) {
            property += " Failed";
        }
        if (property) {
            return property === "Get" ? property + " " + tag : tag + " " + property;
        }
        else {
            return tag;
        }
    }
    getServiceResource(url) {
        const definitions = AppInsights.SERVICE_RESOURCE_DEFINITIONS;
        for (let i = 0; i < definitions.length; i++) {
            if (definitions[i].regExp.test(url)) {
                return definitions[i].resource;
            }
        }
        return ServiceResource.Other;
    }
    getTag(resource) {
        const definitions = AppInsights.SERVICE_RESOURCE_DEFINITIONS;
        for (let i = 0; i < definitions.length; i++) {
            if (definitions[i].resource === resource) {
                return definitions[i].tag;
            }
        }
        return null;
    }
    reportStatus(tagProperties, status, deploymentKey) {
        tagProperties["Deployment Key"] = deploymentKey;
        tagProperties["Deployment status"] = status;
    }
}
exports.AppInsights = AppInsights;

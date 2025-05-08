"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagementRouter = void 0;
const file_upload_manager_1 = require("../file-upload-manager");
const rest_headers_1 = require("../utils/rest-headers");
const rollout_selector_1 = require("../utils/rollout-selector");
const packageDiffing = require("../utils/package-diffing");
const converterUtils = require("../utils/converter");
const diffErrorUtils = require("../utils/diff-error-handling");
const errorUtils = require("../utils/rest-error-handling");
const express_1 = require("express");
const fs = require("fs");
const hashUtils = require("../utils/hash-utils");
const redis = require("../redis-manager");
const security = require("../utils/security");
const semver = require("semver");
const streamifier = require("streamifier");
const storageTypes = require("../storage/storage");
const validationUtils = require("../utils/validation");
var PackageDiffer = packageDiffing.PackageDiffer;
var NameResolver = storageTypes.NameResolver;
const tryJSON = require("try-json");
const express_rate_limit_1 = require("express-rate-limit");
const storage_1 = require("../storage/storage");
const DEFAULT_ACCESS_KEY_EXPIRY = 1000 * 60 * 60 * 24 * 60; // 60 days
const ACCESS_KEY_MASKING_STRING = "(hidden)";
// A template string tag function that URL encodes the substituted values
function urlEncode(strings, ...values) {
    let result = "";
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += encodeURIComponent(values[i]);
        }
    }
    return result;
}
function getManagementRouter(config) {
    const redisManager = config.redisManager;
    const storage = config.storage;
    const packageDiffing = new PackageDiffer(storage, parseInt(process.env.DIFF_PACKAGE_COUNT) || 5);
    const router = (0, express_1.Router)();
    const nameResolver = new NameResolver(config.storage);
    router.get("/account", (req, res, next) => {
        const accountId = req.user.id;
        storage
            .getAccount(accountId)
            .then((storageAccount) => {
            const restAccount = converterUtils.toRestAccount(storageAccount);
            res.send({ account: restAccount });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/account", (req, res, next) => {
        const account = req.body.account;
        //validate blah blah
        storage
            .addAccount(account)
            .then((accountId) => {
            //MARK: TODO issueAccessKey(accountId);
            // const restAccount: restTypes.Account = converterUtils.toRestAccount(storageAccount);
            console.log("accounId created");
            res.send({ account: accountId });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/accessKeys", (req, res, next) => {
        const accountId = req.user.id;
        storage
            .getAccessKeys(accountId)
            .then((accessKeys) => {
            accessKeys.sort((first, second) => {
                const firstTime = first.createdTime || 0;
                const secondTime = second.createdTime || 0;
                return firstTime - secondTime;
            });
            // Hide the actual key string and replace it with a message for legacy CLIs (up to 1.11.0-beta) that still try to display it
            accessKeys.forEach((accessKey) => {
                accessKey.name = ACCESS_KEY_MASKING_STRING;
            });
            res.send({ accessKeys: accessKeys });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/accessKeys", (req, res, next) => {
        const accountId = req.user.id;
        const accessKeyRequest = converterUtils.accessKeyRequestFromBody(req.body);
        if (!accessKeyRequest.name) {
            accessKeyRequest.name = security.generateSecureKey(accountId);
        }
        if (!accessKeyRequest.createdBy) {
            accessKeyRequest.createdBy = (0, rest_headers_1.getIpAddress)(req);
        }
        const validationErrors = validationUtils.validateAccessKeyRequest(accessKeyRequest, 
        /*isUpdate=*/ false);
        if (validationErrors.length) {
            res.status(400).send(validationErrors);
            return;
        }
        const accessKey = accessKeyRequest;
        accessKey.createdTime = new Date().getTime();
        accessKey.expires = accessKey.createdTime + (accessKeyRequest.ttl || DEFAULT_ACCESS_KEY_EXPIRY);
        delete accessKeyRequest.ttl;
        storage
            .getAccessKeys(accountId)
            .then((accessKeys) => {
            if (NameResolver.isDuplicate(accessKeys, accessKey.name)) {
                errorUtils.sendConflictError(res, `The access key "${accessKey.name}" already exists.`);
                return;
            }
            else if (NameResolver.isDuplicate(accessKeys, accessKey.friendlyName)) {
                errorUtils.sendConflictError(res, `The access key "${accessKey.friendlyName}" already exists.`);
                return;
            }
            const storageAccessKey = converterUtils.toStorageAccessKey(accessKey);
            return storage.addAccessKey(accountId, storageAccessKey).then((id) => {
                res.setHeader("Location", urlEncode([`/accessKeys/${accessKey.friendlyName}`]));
                res.status(201).send({ accessKey: accessKey });
            });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/accessKeys/:accessKeyName", (req, res, next) => {
        const accessKeyName = req.params.accessKeyName;
        const accountId = req.user.id;
        nameResolver
            .resolveAccessKey(accountId, accessKeyName)
            .then((accessKey) => {
            const currentTime = Date.now();
            if (accessKey.expires && accessKey.expires < currentTime) {
                res.status(401).send({ error: "Access key has expired" });
                return;
            }
            delete accessKey.name;
            res.send({ accessKey: accessKey });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/accountByaccessKeyName", (req, res, next) => {
        const accessKeyName = Array.isArray(req.headers.accesskeyname) ? req.headers.accesskeyname[0] : req.headers.accesskeyname;
        //validate accessKeyName
        if (!accessKeyName) {
            res.status(400).send("Access key name is required");
            return;
        }
        storage.getUserFromAccessKey(accessKeyName)
            .then((storageAccount) => {
            res.send({ user: storageAccount });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.patch("/accessKeys/:accessKeyName", (req, res, next) => {
        const accountId = req.user.id;
        const accessKeyName = req.params.accessKeyName;
        const accessKeyRequest = converterUtils.accessKeyRequestFromBody(req.body);
        const validationErrors = validationUtils.validateAccessKeyRequest(accessKeyRequest, 
        /*isUpdate=*/ true);
        if (validationErrors.length) {
            res.status(400).send(validationErrors);
            return;
        }
        let updatedAccessKey;
        storage
            .getAccessKeys(accountId)
            .then((accessKeys) => {
            updatedAccessKey = NameResolver.findByName(accessKeys, accessKeyName);
            if (!updatedAccessKey) {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, `The access key "${accessKeyName}" does not exist.`);
            }
            updatedAccessKey.description = accessKeyRequest.description;
            if (accessKeyRequest.friendlyName) {
                if (NameResolver.isDuplicate(accessKeys, accessKeyRequest.friendlyName)) {
                    throw errorUtils.restError(errorUtils.ErrorCode.Conflict, `The access key "${accessKeyRequest.friendlyName}" already exists.`);
                }
                updatedAccessKey.friendlyName = accessKeyRequest.friendlyName;
                updatedAccessKey.description = updatedAccessKey.friendlyName;
            }
            updatedAccessKey.scope = accessKeyRequest.scope;
            if (accessKeyRequest.ttl !== undefined) {
                updatedAccessKey.expires = new Date().getTime() + accessKeyRequest.ttl;
            }
            return storage.updateAccessKey(accountId, updatedAccessKey);
        })
            .then(() => {
            delete updatedAccessKey.name;
            res.send({ accessKey: updatedAccessKey });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.delete("/accessKeys/:accessKeyName", (req, res, next) => {
        const accountId = req.user.id;
        const accessKeyName = req.params.accessKeyName;
        nameResolver
            .resolveAccessKey(accountId, accessKeyName)
            .then((accessKey) => {
            return storage.removeAccessKey(accountId, accessKey.id);
        })
            .then(() => {
            //send message that it is deleted successfully.
            res.sendStatus(201).send("Access key deleted successfully");
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.delete("/sessions/:createdBy", (req, res, next) => {
        const accountId = req.user.id;
        const createdBy = req.params.createdBy;
        storage
            .getAccessKeys(accountId)
            .then((accessKeys) => {
            const accessKeyDeletionPromises = [];
            accessKeys.forEach((accessKey) => {
                if (accessKey.isSession && accessKey.createdBy === createdBy) {
                    accessKeyDeletionPromises.push(storage.removeAccessKey(accountId, accessKey.id));
                }
            });
            if (accessKeyDeletionPromises.length) {
                return Promise.all(accessKeyDeletionPromises);
            }
            else {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, `There are no sessions associated with "${createdBy}."`);
            }
        })
            .then(() => {
            res.sendStatus(204);
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/tenants", (req, res, next) => {
        const accountId = req.user.id;
        storage
            .getTenants(accountId) // Calls the storage method we’ll define next
            .then((tenants) => {
            res.send({ organisations: tenants });
        })
            .catch((error) => {
            next(error); // Forward error to error handler
        });
    });
    router.delete("/tenants/:tenantId", (req, res, next) => {
        const accountId = req.user.id;
        const tenantId = req.params.tenantId;
        storage
            .removeTenant(accountId, tenantId) // Calls the storage method we’ll define next
            .then(() => {
            res.sendStatus(201).send("Org deleted successfully");
        })
            .catch((error) => {
            next(error); // Forward error to error handler
        });
    });
    router.get("/apps", (req, res, next) => {
        const accountId = req.user.id;
        const tenant = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        storage
            .getApps(accountId)
            .then((apps) => {
            const restAppPromises = apps
                .filter((app) => !tenant || app.tenantId === tenant)
                .map((app) => {
                return storage.getDeployments(accountId, app.id).then((deployments) => {
                    const deploymentNames = deployments.map((deployment) => deployment.name);
                    return converterUtils.toRestApp(app, app.name, deploymentNames);
                });
            });
            return Promise.all(restAppPromises);
        })
            .then((restApps) => {
            res.send({ apps: converterUtils.sortAndUpdateDisplayNameOfRestAppsList(restApps) });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/apps", (req, res, next) => {
        const accountId = req.user.id;
        const appRequest = converterUtils.appCreationRequestFromBody(req.body);
        const validationErrors = validationUtils.validateApp(appRequest, /*isUpdate=*/ false);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
        }
        else {
            storage
                .getApps(accountId)
                .then((apps) => {
                if (NameResolver.isDuplicateApp(apps, appRequest)) {
                    errorUtils.sendConflictError(res, "An app named '" + appRequest.name + "' already exists.");
                    return;
                }
                let storageApp = converterUtils.toStorageApp(appRequest, new Date().getTime());
                return storage
                    .addApp(accountId, storageApp)
                    .then((app) => {
                    storageApp = app;
                    if (!appRequest.manuallyProvisionDeployments) {
                        const defaultDeployments = ["Production", "Staging"];
                        const deploymentPromises = defaultDeployments.map((deploymentName) => {
                            const deployment = {
                                createdTime: new Date().getTime(),
                                name: deploymentName,
                                key: security.generateSecureKey(accountId),
                            };
                            return storage.addDeployment(accountId, storageApp.id, deployment).then(() => {
                                return deployment.name;
                            });
                        });
                        return Promise.all(deploymentPromises);
                    }
                })
                    .then((deploymentNames) => {
                    res.setHeader("Location", urlEncode([`/apps/${storageApp.name}`]));
                    res.status(201).send({ app: converterUtils.toRestApp(storageApp, /*displayName=*/ storageApp.name, deploymentNames) });
                });
            })
                .catch((error) => errorUtils.restErrorHandler(res, error, next));
        }
    });
    router.get("/apps/:appName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let storageApp;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            storageApp = app;
            return storage.getDeployments(accountId, app.id);
        })
            .then((deployments) => {
            const deploymentNames = deployments.map((deployment) => deployment.name);
            res.send({ app: converterUtils.toRestApp(storageApp, /*displayName=*/ appName, deploymentNames) });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.delete("/apps/:appName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let invalidationError;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return storage.getDeployments(accountId, appId);
        })
            .then((deployments) => {
            const invalidationPromises = deployments.map((deployment) => {
                return invalidateCachedPackage(deployment.key);
            });
            return Promise.all(invalidationPromises).catch((error) => {
                invalidationError = error; // Do not block app deletion on cache invalidation
            });
        })
            .then(() => {
            return storage.removeApp(accountId, appId);
        })
            .then(() => {
            res.sendStatus(201).send("App deleted successfully");
            if (invalidationError)
                throw invalidationError;
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.patch("/apps/:appName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const app = converterUtils.appFromBody(req.body);
        storage
            .getApps(accountId)
            .then((apps) => {
            const existingApp = NameResolver.findByName(apps, appName);
            if (!existingApp) {
                errorUtils.sendNotFoundError(res, `App "${appName}" does not exist.`);
                return;
            }
            throwIfInvalidPermissions(existingApp, storageTypes.Permissions.Owner);
            if ((app.name || app.name === "") && app.name !== existingApp.name) {
                if (NameResolver.isDuplicate(apps, app.name)) {
                    errorUtils.sendConflictError(res, "An app named '" + app.name + "' already exists.");
                    return;
                }
                existingApp.name = app.name;
            }
            const validationErrors = validationUtils.validateApp(existingApp, /*isUpdate=*/ true);
            if (validationErrors.length) {
                errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            }
            else {
                return storage
                    .updateApp(accountId, existingApp)
                    .then(() => {
                    return storage.getDeployments(accountId, existingApp.id).then((deployments) => {
                        const deploymentNames = deployments.map((deployment) => {
                            return deployment.name;
                        });
                        return converterUtils.toRestApp(existingApp, existingApp.name, deploymentNames);
                    });
                })
                    .then((restApp) => {
                    res.send({ app: restApp });
                });
            }
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/apps/:appName/transfer/:email", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const email = req.params.email;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        if ((0, storage_1.isPrototypePollutionKey)(email)) {
            return res.status(400).send("Invalid email parameter");
        }
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return storage.transferApp(accountId, app.id, email);
        })
            .then(() => {
            res.sendStatus(201);
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/apps/:appName/collaborators/:email", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const email = req.params.email;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        if ((0, storage_1.isPrototypePollutionKey)(email)) {
            return res.status(400).send("Invalid email parameter");
        }
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return storage.addCollaborator(accountId, app.id, email);
        })
            .then(() => {
            res.sendStatus(201);
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/apps/:appName/collaborators", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return storage.getCollaborators(accountId, app.id);
        })
            .then((retrievedMap) => {
            res.send({ collaborators: converterUtils.toRestCollaboratorMap(retrievedMap) });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.delete("/apps/:appName/collaborators/:email", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const email = req.params.email;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        if ((0, storage_1.isPrototypePollutionKey)(email)) {
            return res.status(400).send("Invalid email parameter");
        }
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            const isAttemptingToRemoveSelf = app.collaborators && email && app.collaborators[email] && app.collaborators[email].isCurrentAccount;
            throwIfInvalidPermissions(app, isAttemptingToRemoveSelf ? storageTypes.Permissions.Collaborator : storageTypes.Permissions.Owner);
            return storage.removeCollaborator(accountId, app.id, email);
        })
            .then(() => {
            res.sendStatus(201).send("Collaborator removed successfully");
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.patch("/apps/:appName/collaborators/:email", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const email = req.params.email;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let role = "Collaborator";
        if (req.body.role !== undefined) {
            role = req.body.role;
        }
        if ((0, storage_1.isPrototypePollutionKey)(email)) {
            return res.status(400).send("Invalid email parameter");
        }
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            const isAdmin = app.collaborators && email && app.collaborators[email] && app.collaborators[email].isCurrentAccount;
            let permission = role === "Owner" ? storageTypes.Permissions.Owner : storageTypes.Permissions.Collaborator;
            throwIfInvalidPermissions(app, permission);
            return storage.updateCollaborators(accountId, app.id, email, role);
        })
            .then(() => {
            res.sendStatus(204);
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/apps/:appName/deployments", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        let appId;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return storage.getDeployments(accountId, appId);
        })
            .then(async (deployments) => {
            deployments.sort((first, second) => {
                return first.name.localeCompare(second.name);
            });
            if (redisManager.isEnabled) {
                for (const deployment of deployments) {
                    const metrics = await redisManager.getMetricsWithDeploymentKey(deployment.key);
                    const deploymentMetrics = converterUtils.toRestDeploymentMetrics(metrics);
                    let totalActiveCount = 0;
                    Object.keys(deploymentMetrics).forEach((label) => {
                        const metrics = deploymentMetrics[label];
                        if (metrics.active < 0)
                            metrics.active = 0;
                        totalActiveCount += metrics.active;
                    });
                    if (deployment.packageHistory) {
                        deployment.packageHistory.forEach((pkg) => {
                            if (deploymentMetrics[pkg.label]) {
                                const pkgMetrics = deploymentMetrics[pkg.label];
                                pkg.active = pkgMetrics.active || 0;
                                pkg.downloaded = pkgMetrics.downloaded || 0;
                                pkg.failed = pkgMetrics.failed || 0;
                                pkg.installed = pkgMetrics.installed || 0;
                                pkg.totalActive = totalActiveCount;
                            }
                        });
                    }
                }
            }
            res.send({ deployments: deployments });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/apps/:appName/deployments", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let restDeployment = converterUtils.deploymentFromBody(req.body);
        const validationErrors = validationUtils.validateDeployment(restDeployment, /*isUpdate=*/ false);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            return;
        }
        const storageDeployment = converterUtils.toStorageDeployment(restDeployment, new Date().getTime());
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return storage.getDeployments(accountId, app.id);
        })
            .then((deployments) => {
            if (NameResolver.isDuplicate(deployments, restDeployment.name)) {
                errorUtils.sendConflictError(res, "A deployment named '" + restDeployment.name + "' already exists.");
                return;
            }
            // Allow the deployment key to be specified on creation, if desired
            storageDeployment.key = restDeployment.key || security.generateSecureKey(accountId);
            return storage.addDeployment(accountId, appId, storageDeployment).then((deploymentId) => {
                restDeployment = converterUtils.toRestDeployment(storageDeployment);
                res.setHeader("Location", urlEncode([`/apps/${appName}/deployments/${restDeployment.name}`]));
                res.status(201).send({ deployment: restDeployment });
            });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/apps/:appName/deployments/:deploymentName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return nameResolver.resolveDeployment(accountId, appId, deploymentName);
        })
            .then(async (deployment) => {
            const metrics = await redisManager.getMetricsWithDeploymentKey(deployment.key);
            const deploymentMetrics = converterUtils.toRestDeploymentMetrics(metrics);
            let totalActiveCount = 0;
            Object.keys(deploymentMetrics).forEach((label) => {
                const metrics = deploymentMetrics[label];
                if (metrics.active < 0) {
                    metrics.active = 0;
                }
                totalActiveCount += metrics.active;
            });
            if (deployment.packageHistory) {
                deployment.packageHistory.forEach((pkg) => {
                    if (deploymentMetrics[pkg.label]) {
                        const pkgMetrics = deploymentMetrics[pkg.label];
                        pkg.active = pkgMetrics.active || 0;
                        pkg.downloaded = pkgMetrics.downloaded || 0;
                        pkg.failed = pkgMetrics.failed || 0;
                        pkg.installed = pkgMetrics.installed || 0;
                        pkg.totalActive = totalActiveCount;
                    }
                });
            }
            const restDeployment = converterUtils.toRestDeployment(deployment);
            res.send({ deployment: restDeployment });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.delete("/apps/:appName/deployments/:deploymentName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let deploymentId;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return nameResolver.resolveDeployment(accountId, appId, deploymentName);
        })
            .then((deployment) => {
            deploymentId = deployment.id;
            return invalidateCachedPackage(deployment.key);
        })
            .then(() => {
            return storage.removeDeployment(accountId, appId, deploymentId);
        })
            .then(() => {
            res.sendStatus(201).send("Deployment deleted successfully");
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.patch("/apps/:appName/deployments/:deploymentName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let restDeployment = converterUtils.deploymentFromBody(req.body);
        const validationErrors = validationUtils.validateDeployment(restDeployment, /*isUpdate=*/ true);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            return;
        }
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return storage.getDeployments(accountId, app.id);
        })
            .then((storageDeployments) => {
            const storageDeployment = NameResolver.findByName(storageDeployments, deploymentName);
            if (!storageDeployment) {
                errorUtils.sendNotFoundError(res, `Deployment "${deploymentName}" does not exist.`);
                return;
            }
            if ((restDeployment.name || restDeployment.name === "") && restDeployment.name !== storageDeployment.name) {
                if (NameResolver.isDuplicate(storageDeployments, restDeployment.name)) {
                    errorUtils.sendConflictError(res, "A deployment named '" + restDeployment.name + "' already exists.");
                    return;
                }
                storageDeployment.name = restDeployment.name;
            }
            restDeployment = converterUtils.toRestDeployment(storageDeployment);
            return storage.updateDeployment(accountId, appId, storageDeployment).then(() => {
                res.send({ deployment: restDeployment });
            });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.patch("/apps/:appName/deployments/:deploymentName/release", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const info = req.body.packageInfo || {};
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        const validationErrors = validationUtils.validatePackageInfo(info, /*allOptional*/ true);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            return;
        }
        let updateRelease = false;
        let storageDeployment;
        let appId;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return storage.getDeployments(accountId, app.id);
        })
            .then((storageDeployments) => {
            storageDeployment = NameResolver.findByName(storageDeployments, deploymentName);
            if (!storageDeployment) {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, `Deployment "${deploymentName}" does not exist.`);
            }
            return storage.getPackageHistory(accountId, appId, storageDeployment.id);
        })
            .then((packageHistory) => {
            if (!packageHistory.length) {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, "Deployment has no releases.");
            }
            const packageToUpdate = info.label
                ? getPackageFromLabel(packageHistory, info.label)
                : packageHistory[packageHistory.length - 1];
            if (!packageToUpdate) {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, "Release not found for given label.");
            }
            const newIsDisabled = info.isDisabled;
            if (validationUtils.isDefined(newIsDisabled) && packageToUpdate.isDisabled !== newIsDisabled) {
                packageToUpdate.isDisabled = newIsDisabled;
                updateRelease = true;
            }
            const newIsMandatory = info.isMandatory;
            if (validationUtils.isDefined(newIsMandatory) && packageToUpdate.isMandatory !== newIsMandatory) {
                packageToUpdate.isMandatory = newIsMandatory;
                updateRelease = true;
            }
            if (info.description && packageToUpdate.description !== info.description) {
                packageToUpdate.description = info.description;
                updateRelease = true;
            }
            const newAppVersion = info.appVersion;
            if (newAppVersion && packageToUpdate.appVersion !== newAppVersion) {
                packageToUpdate.appVersion = newAppVersion;
                updateRelease = true;
            }
            const newRolloutValue = info.rollout;
            if (validationUtils.isDefined(newRolloutValue)) {
                let errorMessage;
                if (!(0, rollout_selector_1.isUnfinishedRollout)(packageToUpdate.rollout) && !updateRelease) {
                    errorMessage = "Cannot update rollout value for a completed rollout release.";
                }
                else if (packageToUpdate.rollout > newRolloutValue && newRolloutValue !== 100) {
                    errorMessage = `Rollout value must be greater than "${packageToUpdate.rollout}", the existing value.`;
                }
                if (errorMessage) {
                    throw errorUtils.restError(errorUtils.ErrorCode.Conflict, errorMessage);
                }
                packageToUpdate.rollout = newRolloutValue === 100 ? 100 : newRolloutValue;
                updateRelease = true;
            }
            if (updateRelease) {
                return storage.updatePackageHistory(accountId, appId, storageDeployment.id, packageHistory).then(() => {
                    res.send({ package: converterUtils.toRestPackage(packageToUpdate) });
                    return invalidateCachedPackage(storageDeployment.key);
                });
            }
            else {
                res.sendStatus(204);
            }
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    const releaseRateLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100, // limit each IP to 100 requests per windowMs
    });
    router.post("/apps/:appName/deployments/:deploymentName/release", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const file = (0, file_upload_manager_1.getFileWithField)(req, "package");
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        if (!file || !file.buffer) {
            errorUtils.sendMalformedRequestError(res, "A deployment package must include a file.");
            return;
        }
        const filePath = (0, file_upload_manager_1.createTempFileFromBuffer)(file.buffer);
        const restPackage = tryJSON(req.body.packageInfo) || {};
        const validationErrors = validationUtils.validatePackageInfo(restPackage, 
        /*allOptional*/ false);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            return;
        }
        fs.stat(filePath, (err, stats) => {
            if (err) {
                errorUtils.sendUnknownError(res, err, next);
                return;
            }
            // These variables are for hoisting promise results and flattening the following promise chain.
            let appId;
            let deploymentToReleaseTo;
            let storagePackage;
            let lastPackageHashWithSameAppVersion;
            let newManifest;
            nameResolver
                .resolveApp(accountId, appName, tenantId)
                .then((app) => {
                appId = app.id;
                throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
                return nameResolver.resolveDeployment(accountId, appId, deploymentName);
            })
                .then((deployment) => {
                deploymentToReleaseTo = deployment;
                const existingPackage = deployment.package;
                if (existingPackage && (0, rollout_selector_1.isUnfinishedRollout)(existingPackage.rollout) && !existingPackage.isDisabled) {
                    throw errorUtils.restError(errorUtils.ErrorCode.Conflict, "Please update the previous release to 100% rollout before releasing a new package.");
                }
                return storage.getPackageHistory(accountId, appId, deploymentToReleaseTo.id);
            })
                .then((history) => {
                lastPackageHashWithSameAppVersion = getLastPackageHashWithSameAppVersion(history, restPackage.appVersion);
                return hashUtils.generatePackageManifestFromZip(filePath);
            })
                .then((manifest) => {
                if (manifest) {
                    newManifest = manifest;
                    // If update is a zip, generate a packageHash using the manifest, since
                    // that more accurately represents the contents of each file in the zip.
                    return newManifest.computePackageHash();
                }
                else {
                    // Update is not a zip (flat file), generate the packageHash over the
                    // entire file contents.
                    return hashUtils.hashFile(filePath);
                }
            })
                .then((packageHash) => {
                restPackage.packageHash = packageHash;
                if (restPackage.packageHash === lastPackageHashWithSameAppVersion) {
                    throw errorUtils.restError(errorUtils.ErrorCode.Conflict, "The uploaded package was not released because it is identical to the contents of the specified deployment's current release.");
                }
                return storage.addBlob(security.generateSecureKey(accountId), fs.createReadStream(filePath), stats.size);
            })
                .then((blobId) => storage.getBlobUrl(blobId))
                .then((blobUrl) => {
                restPackage.blobUrl = blobUrl;
                restPackage.size = stats.size;
                // If newManifest is null/undefined, then the package is not a valid ZIP file.
                if (newManifest) {
                    const json = newManifest.serialize();
                    const readStream = streamifier.createReadStream(json);
                    return storage.addBlob(security.generateSecureKey(accountId), readStream, json.length);
                }
                return Promise.resolve(null);
            })
                .then((blobId) => {
                if (blobId) {
                    return storage.getBlobUrl(blobId);
                }
                return Promise.resolve(null);
            })
                .then((manifestBlobUrl) => {
                storagePackage = converterUtils.toStoragePackage(restPackage);
                if (manifestBlobUrl) {
                    storagePackage.manifestBlobUrl = manifestBlobUrl;
                }
                storagePackage.releaseMethod = storageTypes.ReleaseMethod.Upload;
                storagePackage.uploadTime = new Date().getTime();
                return storage.commitPackage(accountId, appId, deploymentToReleaseTo.id, storagePackage);
            })
                .then((committedPackage) => {
                storagePackage.label = committedPackage.label;
                const restPackage = converterUtils.toRestPackage(committedPackage);
                res.setHeader("Location", urlEncode([`/apps/${appName}/deployments/${deploymentName}`]));
                res.status(201).send({ package: restPackage }); // Send response without blocking on cleanup
                return invalidateCachedPackage(deploymentToReleaseTo.key);
            })
                .then(() => processDiff(accountId, appId, deploymentToReleaseTo.id, storagePackage))
                .finally(() => {
                // Cleanup; any errors before this point will still pass to the catch() block
                fs.unlink(filePath, (err) => {
                    if (err) {
                        errorUtils.sendUnknownError(res, err, next);
                    }
                });
            })
                .catch((error) => errorUtils.restErrorHandler(res, error, next));
        });
    });
    router.delete("/apps/:appName/deployments/:deploymentName/history", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let deploymentToGetHistoryOf;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Owner);
            return nameResolver.resolveDeployment(accountId, appId, deploymentName);
        })
            .then((deployment) => {
            deploymentToGetHistoryOf = deployment;
            return storage.clearPackageHistory(accountId, appId, deploymentToGetHistoryOf.id);
        })
            .then(() => {
            if (redisManager.isEnabled) {
                return redisManager.clearMetricsForDeploymentKey(deploymentToGetHistoryOf.key);
            }
            else {
                return Promise.resolve(null);
            }
        })
            .then(() => {
            res.sendStatus(201).send("Deployment History deleted successfully");
            return invalidateCachedPackage(deploymentToGetHistoryOf.key);
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/apps/:appName/deployments/:deploymentName/history", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return nameResolver.resolveDeployment(accountId, appId, deploymentName);
        })
            .then((deployment) => {
            return storage.getPackageHistory(accountId, appId, deployment.id);
        })
            .then((packageHistory) => {
            res.send({ history: packageHistory });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.get("/apps/:appName/deployments/:deploymentName/metrics", (req, res, next) => {
        if (!redisManager.isEnabled) {
            res.send({ metrics: {} });
        }
        else {
            const accountId = req.user.id;
            const appName = req.params.appName;
            const deploymentName = req.params.deploymentName;
            const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
            let appId;
            nameResolver
                .resolveApp(accountId, appName, tenantId)
                .then((app) => {
                appId = app.id;
                throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
                return nameResolver.resolveDeployment(accountId, appId, deploymentName);
            })
                .then((deployment) => {
                return redisManager.getMetricsWithDeploymentKey(deployment.key);
            })
                .then((metrics) => {
                const deploymentMetrics = converterUtils.toRestDeploymentMetrics(metrics);
                res.send({ metrics: deploymentMetrics });
            })
                .catch((error) => errorUtils.restErrorHandler(res, error, next));
        }
    });
    router.post("/apps/:appName/deployments/:sourceDeploymentName/promote/:destDeploymentName", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const sourceDeploymentName = req.params.sourceDeploymentName;
        const destDeploymentName = req.params.destDeploymentName;
        const info = req.body.packageInfo || {};
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        const validationErrors = validationUtils.validatePackageInfo(info, /*allOptional*/ true);
        if (validationErrors.length) {
            errorUtils.sendMalformedRequestError(res, JSON.stringify(validationErrors));
            return;
        }
        let appId;
        let destDeployment;
        let sourcePackage;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            // Get source and dest manifests in parallel.
            return Promise.all([
                nameResolver.resolveDeployment(accountId, appId, sourceDeploymentName),
                nameResolver.resolveDeployment(accountId, appId, destDeploymentName),
            ]);
        })
            .then(([sourceDeployment, destinationDeployment]) => {
            destDeployment = destinationDeployment;
            if (info.label) {
                return storage.getPackageHistory(accountId, appId, sourceDeployment.id).then((sourceHistory) => {
                    sourcePackage = getPackageFromLabel(sourceHistory, info.label);
                });
            }
            else {
                sourcePackage = sourceDeployment.package;
            }
        })
            .then(() => {
            const destPackage = destDeployment.package;
            if (!sourcePackage) {
                throw errorUtils.restError(errorUtils.ErrorCode.NotFound, "Cannot promote from a deployment with no enabled releases.");
            }
            else if (validationUtils.isDefined(info.rollout) && !validationUtils.isValidRolloutField(info.rollout)) {
                throw errorUtils.restError(errorUtils.ErrorCode.MalformedRequest, "Rollout value must be an integer between 1 and 100, inclusive.");
            }
            else if (destPackage && (0, rollout_selector_1.isUnfinishedRollout)(destPackage.rollout) && !destPackage.isDisabled) {
                throw errorUtils.restError(errorUtils.ErrorCode.Conflict, "Cannot promote to an unfinished rollout release unless it is already disabled.");
            }
            return storage.getPackageHistory(accountId, appId, destDeployment.id);
        })
            .then((destHistory) => {
            if (sourcePackage.packageHash === getLastPackageHashWithSameAppVersion(destHistory, sourcePackage.appVersion)) {
                throw errorUtils.restError(errorUtils.ErrorCode.Conflict, "The uploaded package was not promoted because it is identical to the contents of the targeted deployment's current release.");
            }
            const isMandatory = validationUtils.isDefined(info.isMandatory) ? info.isMandatory : sourcePackage.isMandatory;
            const newPackage = {
                appVersion: info.appVersion ? info.appVersion : sourcePackage.appVersion,
                blobUrl: sourcePackage.blobUrl,
                description: info.description || sourcePackage.description,
                isDisabled: validationUtils.isDefined(info.isDisabled) ? info.isDisabled : sourcePackage.isDisabled,
                isMandatory: isMandatory,
                manifestBlobUrl: sourcePackage.manifestBlobUrl,
                packageHash: sourcePackage.packageHash,
                rollout: info.rollout || null,
                size: sourcePackage.size,
                uploadTime: new Date().getTime(),
                releaseMethod: storageTypes.ReleaseMethod.Promote,
                originalLabel: sourcePackage.label,
                originalDeployment: sourceDeploymentName,
            };
            return storage
                .commitPackage(accountId, appId, destDeployment.id, newPackage)
                .then((committedPackage) => {
                sourcePackage.label = committedPackage.label;
                const restPackage = converterUtils.toRestPackage(committedPackage);
                res.setHeader("Location", urlEncode([`/apps/${appName}/deployments/${destDeploymentName}`]));
                res.status(201).send({ package: restPackage });
                return invalidateCachedPackage(destDeployment.key);
            })
                .then(() => processDiff(accountId, appId, destDeployment.id, sourcePackage));
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    router.post("/apps/:appName/deployments/:deploymentName/rollback/:targetRelease?", (req, res, next) => {
        const accountId = req.user.id;
        const appName = req.params.appName;
        const deploymentName = req.params.deploymentName;
        const tenantId = Array.isArray(req.headers.tenant) ? req.headers.tenant[0] : req.headers.tenant;
        let appId;
        let deploymentToRollback;
        const targetRelease = req.params.targetRelease;
        let destinationPackage;
        nameResolver
            .resolveApp(accountId, appName, tenantId)
            .then((app) => {
            appId = app.id;
            throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
            return nameResolver.resolveDeployment(accountId, appId, deploymentName);
        })
            .then((deployment) => {
            deploymentToRollback = deployment;
            return storage.getPackageHistory(accountId, appId, deployment.id);
        })
            .then((packageHistory) => {
            const sourcePackage = packageHistory && packageHistory.length ? packageHistory[packageHistory.length - 1] : null;
            if (!sourcePackage) {
                errorUtils.sendNotFoundError(res, "Cannot perform rollback because there are no releases on this deployment.");
                return;
            }
            if (!targetRelease) {
                destinationPackage = packageHistory[packageHistory.length - 2];
                if (!destinationPackage) {
                    errorUtils.sendNotFoundError(res, "Cannot perform rollback because there are no prior releases to rollback to.");
                    return;
                }
            }
            else {
                if (targetRelease === sourcePackage.label) {
                    errorUtils.sendConflictError(res, `Cannot perform rollback because the target release (${targetRelease}) is already the latest release.`);
                    return;
                }
                packageHistory.forEach((packageEntry) => {
                    if (packageEntry.label === targetRelease) {
                        destinationPackage = packageEntry;
                    }
                });
                if (!destinationPackage) {
                    errorUtils.sendNotFoundError(res, `Cannot perform rollback because the target release (${targetRelease}) could not be found in the deployment history.`);
                    return;
                }
            }
            if (sourcePackage.appVersion !== destinationPackage.appVersion) {
                errorUtils.sendConflictError(res, "Cannot perform rollback to a different app version. Please perform a new release with the desired replacement package.");
                return;
            }
            const newPackage = {
                appVersion: destinationPackage.appVersion,
                blobUrl: destinationPackage.blobUrl,
                description: destinationPackage.description,
                diffPackageMap: destinationPackage.diffPackageMap,
                isDisabled: destinationPackage.isDisabled,
                isMandatory: destinationPackage.isMandatory,
                manifestBlobUrl: destinationPackage.manifestBlobUrl,
                packageHash: destinationPackage.packageHash,
                size: destinationPackage.size,
                uploadTime: new Date().getTime(),
                releaseMethod: storageTypes.ReleaseMethod.Rollback,
                originalLabel: destinationPackage.label,
            };
            return storage.commitPackage(accountId, appId, deploymentToRollback.id, newPackage).then(() => {
                const restPackage = converterUtils.toRestPackage(newPackage);
                res.setHeader("Location", urlEncode([`/apps/${appName}/deployments/${deploymentName}`]));
                res.status(201).send({ package: restPackage });
                return invalidateCachedPackage(deploymentToRollback.key);
            });
        })
            .catch((error) => errorUtils.restErrorHandler(res, error, next));
    });
    function invalidateCachedPackage(deploymentKey) {
        return redisManager.invalidateCache(redis.Utilities.getDeploymentKeyHash(deploymentKey));
    }
    function throwIfInvalidPermissions(app, requiredPermission) {
        const collaboratorsMap = app.collaborators;
        let isPermitted = false;
        if (collaboratorsMap) {
            for (const email of Object.keys(collaboratorsMap)) {
                if (collaboratorsMap[email].isCurrentAccount) {
                    const permission = collaboratorsMap[email].permission;
                    isPermitted = permission === storageTypes.Permissions.Owner || permission === requiredPermission;
                    break;
                }
            }
        }
        if (!isPermitted)
            throw errorUtils.restError(errorUtils.ErrorCode.Unauthorized, "This action requires " + requiredPermission + " permissions on the app!");
        return true;
    }
    function getPackageFromLabel(history, label) {
        if (!history) {
            return null;
        }
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].label === label) {
                return history[i];
            }
        }
        return null;
    }
    function getLastPackageHashWithSameAppVersion(history, appVersion) {
        if (!history || !history.length) {
            return null;
        }
        const lastPackageIndex = history.length - 1;
        if (!semver.valid(appVersion)) {
            // appVersion is a range
            const oldAppVersion = history[lastPackageIndex].appVersion;
            const oldRange = semver.validRange(oldAppVersion);
            const newRange = semver.validRange(appVersion);
            return oldRange === newRange ? history[lastPackageIndex].packageHash : null;
        }
        else {
            // appVersion is not a range
            for (let i = lastPackageIndex; i >= 0; i--) {
                if (semver.satisfies(appVersion, history[i].appVersion)) {
                    return history[i].packageHash;
                }
            }
        }
        return null;
    }
    function addDiffInfoForPackage(accountId, appId, deploymentId, appPackage, diffPackageMap) {
        let updateHistory = false;
        return storage
            .getApp(accountId, appId)
            .then((storageApp) => {
            throwIfInvalidPermissions(storageApp, storageTypes.Permissions.Collaborator);
            return storage.getPackageHistory(accountId, appId, deploymentId);
        })
            .then((history) => {
            if (history) {
                for (let i = history.length - 1; i >= 0; i--) {
                    if (history[i].label === appPackage.label && !history[i].diffPackageMap) {
                        history[i].diffPackageMap = diffPackageMap;
                        updateHistory = true;
                        break;
                    }
                }
                if (updateHistory) {
                    return storage.updatePackageHistory(accountId, appId, deploymentId, history);
                }
            }
        })
            .then(() => {
            if (updateHistory) {
                //MARK: TODO This Method needs to be TESTed
                return storage.getDeployment(accountId, appId, deploymentId).then((deployment) => {
                    return invalidateCachedPackage(deployment.key);
                });
            }
        })
            .catch(diffErrorUtils.diffErrorHandler);
    }
    function processDiff(accountId, appId, deploymentId, appPackage) {
        if (!appPackage.manifestBlobUrl || process.env.ENABLE_PACKAGE_DIFFING) {
            // No need to process diff because either:
            //   1. The release just contains a single file.
            //   2. Diffing disabled.
            return Promise.resolve(null);
        }
        console.log(`Processing package: ${appPackage.label}`);
        return packageDiffing
            .generateDiffPackageMap(accountId, appId, deploymentId, appPackage)
            .then((diffPackageMap) => {
            console.log(`Package processed, adding diff info`);
            addDiffInfoForPackage(accountId, appId, deploymentId, appPackage, diffPackageMap);
        });
    }
    return router;
}
exports.getManagementRouter = getManagementRouter;

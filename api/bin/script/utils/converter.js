"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStoragePackage = exports.toStorageDeployment = exports.toStorageCollaboratorMap = exports.toStorageApp = exports.toStorageAccessKey = exports.toRestPackage = exports.toRestDeploymentMetrics = exports.toRestDeployment = exports.toRestCollaboratorMap = exports.toRestApp = exports.sortAndUpdateDisplayNameOfRestAppsList = exports.toRestAccount = exports.deploymentFromBody = exports.appCreationRequestFromBody = exports.appFromBody = exports.accountFromBody = exports.accessKeyRequestFromBody = void 0;
const nodeDeepCopy = require("node-deepcopy");
const Storage = require("../storage/storage");
const redis = require("../redis-manager");
function accessKeyRequestFromBody(body) {
    const accessKeyRequest = {};
    if (body.createdBy !== undefined) {
        accessKeyRequest.createdBy = body.createdBy;
    }
    if (body.ttl !== undefined) {
        // Use parseInt in case the value sent to us is a string. parseInt will return the same number if it is already a number.
        accessKeyRequest.ttl = parseInt(body.ttl, 10);
    }
    if (body.name !== undefined) {
        accessKeyRequest.name = body.name;
    }
    if (body.scope !== undefined) {
        accessKeyRequest.scope = body.scope;
    }
    // This caters to legacy CLIs, before "description" was renamed to "friendlyName".
    if (body.scope !== undefined) {
        accessKeyRequest.friendlyName = body.friendlyName;
    }
    accessKeyRequest.friendlyName = accessKeyRequest.friendlyName && accessKeyRequest.friendlyName.trim();
    accessKeyRequest.description = accessKeyRequest.description;
    return accessKeyRequest;
}
exports.accessKeyRequestFromBody = accessKeyRequestFromBody;
function accountFromBody(body) {
    const account = {};
    account.name = body.name;
    account.email = body.email;
    return account;
}
exports.accountFromBody = accountFromBody;
function appFromBody(body) {
    const app = {};
    app.name = body.name;
    return app;
}
exports.appFromBody = appFromBody;
function appCreationRequestFromBody(body) {
    const appCreationRequest = {};
    appCreationRequest.name = body.name;
    appCreationRequest.manuallyProvisionDeployments = body.manuallyProvisionDeployments;
    if (body.organisation !== undefined) {
        appCreationRequest.organisation = {};
        appCreationRequest.organisation.orgId = body.organisation.orgId;
        appCreationRequest.organisation.orgName = body.organisation.orgName;
    }
    return appCreationRequest;
}
exports.appCreationRequestFromBody = appCreationRequestFromBody;
function deploymentFromBody(body) {
    const deployment = {};
    deployment.name = body.name;
    deployment.key = body.key;
    return deployment;
}
exports.deploymentFromBody = deploymentFromBody;
function toRestAccount(storageAccount) {
    const restAccount = {
        name: storageAccount.name,
        email: storageAccount.email,
        linkedProviders: [],
    };
    if (storageAccount.azureAdId)
        restAccount.linkedProviders.push("AAD");
    if (storageAccount.gitHubId)
        restAccount.linkedProviders.push("GitHub");
    if (storageAccount.microsoftId)
        restAccount.linkedProviders.push("Microsoft");
    return restAccount;
}
exports.toRestAccount = toRestAccount;
function sortAndUpdateDisplayNameOfRestAppsList(apps) {
    const nameToCountMap = {};
    apps.forEach((app) => {
        nameToCountMap[app.name] = nameToCountMap[app.name] || 0;
        nameToCountMap[app.name]++;
    });
    return apps
        .sort((first, second) => {
        // Sort by raw name instead of display name
        return first.name.localeCompare(second.name);
    })
        .map((app) => {
        const storageApp = toStorageApp(app, 0);
        let name = app.name;
        if (nameToCountMap[app.name] > 1 && !Storage.isOwnedByCurrentUser(storageApp)) {
            const ownerEmail = Storage.getOwnerEmail(storageApp);
            if (!ownerEmail) {
                name = `${ownerEmail}:${app.name}`;
            }
        }
        return toRestApp(storageApp, name, app.deployments);
    });
}
exports.sortAndUpdateDisplayNameOfRestAppsList = sortAndUpdateDisplayNameOfRestAppsList;
function toRestApp(storageApp, displayName, deploymentNames) {
    const sortedDeploymentNames = deploymentNames
        ? deploymentNames.sort((first, second) => {
            return first.localeCompare(second);
        })
        : null;
    return {
        name: displayName,
        collaborators: toRestCollaboratorMap(storageApp.collaborators),
        deployments: sortedDeploymentNames,
    };
}
exports.toRestApp = toRestApp;
function toRestCollaboratorMap(storageCollaboratorMap) {
    // Safeguard against null or undefined input
    if (!storageCollaboratorMap) {
        return {};
    }
    const collaboratorMap = {};
    Object.keys(storageCollaboratorMap)
        .sort()
        .forEach(function (key) {
        collaboratorMap[key] = {
            isCurrentAccount: storageCollaboratorMap[key].isCurrentAccount,
            permission: storageCollaboratorMap[key].permission,
        };
    });
    return collaboratorMap;
}
exports.toRestCollaboratorMap = toRestCollaboratorMap;
function toRestDeployment(storageDeployment) {
    const restDeployment = {
        name: storageDeployment.name,
        key: storageDeployment.key,
        package: storageDeployment.package,
        packageHistory: storageDeployment.packageHistory,
    };
    if (restDeployment.package) {
        delete restDeployment.package.manifestBlobUrl;
    }
    return restDeployment;
}
exports.toRestDeployment = toRestDeployment;
function toRestDeploymentMetrics(metricsFromRedis) {
    if (!metricsFromRedis) {
        return {};
    }
    const restDeploymentMetrics = {};
    const totalActive = 0;
    const labelRegex = /^v\d+$/;
    Object.keys(metricsFromRedis).forEach((metricKey) => {
        const parsedKey = metricKey.split(":");
        const label = parsedKey[0];
        const metricType = parsedKey[1];
        if (!restDeploymentMetrics[label]) {
            restDeploymentMetrics[label] = labelRegex.test(label)
                ? {
                    active: 0,
                    downloaded: 0,
                    failed: 0,
                    installed: 0,
                }
                : {
                    active: 0,
                };
        }
        switch (metricType) {
            case redis.ACTIVE:
                restDeploymentMetrics[label].active += metricsFromRedis[metricKey];
                break;
            case redis.DOWNLOADED:
                restDeploymentMetrics[label].downloaded += metricsFromRedis[metricKey];
                break;
            case redis.DEPLOYMENT_SUCCEEDED:
                restDeploymentMetrics[label].installed += metricsFromRedis[metricKey];
                break;
            case redis.DEPLOYMENT_FAILED:
                restDeploymentMetrics[label].failed += metricsFromRedis[metricKey];
                break;
        }
    });
    return restDeploymentMetrics;
}
exports.toRestDeploymentMetrics = toRestDeploymentMetrics;
function toRestPackage(storagePackage) {
    const copy = nodeDeepCopy.deepCopy(storagePackage);
    const cast = copy;
    delete cast.manifestBlobUrl;
    if (copy.rollout === undefined || copy.rollout === null)
        copy.rollout = 100;
    return copy;
}
exports.toRestPackage = toRestPackage;
function toStorageAccessKey(restAccessKey) {
    const storageAccessKey = {
        name: restAccessKey.name,
        createdTime: restAccessKey.createdTime,
        createdBy: restAccessKey.createdBy,
        expires: restAccessKey.expires,
        friendlyName: restAccessKey.friendlyName,
        description: restAccessKey.friendlyName,
        scope: restAccessKey.scope,
    };
    return storageAccessKey;
}
exports.toStorageAccessKey = toStorageAccessKey;
function toStorageApp(restApp, createdTime) {
    const storageApp = {
        createdTime: createdTime,
        name: restApp.name,
        collaborators: toStorageCollaboratorMap(restApp.collaborators),
        tenantId: restApp.organisation?.orgId,
        tenantName: restApp.organisation?.orgName,
    };
    return storageApp;
}
exports.toStorageApp = toStorageApp;
function toStorageCollaboratorMap(restCollaboratorMap) {
    if (!restCollaboratorMap)
        return null;
    return nodeDeepCopy.deepCopy(restCollaboratorMap);
}
exports.toStorageCollaboratorMap = toStorageCollaboratorMap;
function toStorageDeployment(restDeployment, createdTime) {
    const storageDeployment = {
        createdTime: createdTime,
        name: restDeployment.name,
        key: restDeployment.key,
        package: nodeDeepCopy.deepCopy(restDeployment.package),
    };
    return storageDeployment;
}
exports.toStorageDeployment = toStorageDeployment;
function toStoragePackage(restPackage) {
    return nodeDeepCopy.deepCopy(restPackage);
}
exports.toStoragePackage = toStoragePackage;

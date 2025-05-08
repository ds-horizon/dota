"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorage = void 0;
const shortid = require("shortid");
const storage = require("./storage");
const utils = require("../utils/common");
const storage_blob_1 = require("@azure/storage-blob");
const data_tables_1 = require("@azure/data-tables");
const storage_1 = require("./storage");
const aws_storage_1 = require("./aws-storage");
var Keys;
(function (Keys) {
    // Can these symbols break us?
    const DELIMITER = " ";
    const LEAF_MARKER = "*";
    function getAccountPartitionKey(accountId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return "accountId" + DELIMITER + accountId;
    }
    Keys.getAccountPartitionKey = getAccountPartitionKey;
    function getAccountAddress(accountId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return {
            partitionKeyPointer: getAccountPartitionKey(accountId),
            rowKeyPointer: getHierarchicalAccountRowKey(accountId),
        };
    }
    Keys.getAccountAddress = getAccountAddress;
    function getAppPartitionKey(appId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return "appId" + DELIMITER + appId;
    }
    Keys.getAppPartitionKey = getAppPartitionKey;
    function getHierarchicalAppRowKey(appId, deploymentId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return generateHierarchicalAppKey(/*markLeaf=*/ true, appId, deploymentId);
    }
    Keys.getHierarchicalAppRowKey = getHierarchicalAppRowKey;
    function getHierarchicalAccountRowKey(accountId, appId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return generateHierarchicalAccountKey(/*markLeaf=*/ true, accountId, appId);
    }
    Keys.getHierarchicalAccountRowKey = getHierarchicalAccountRowKey;
    function generateHierarchicalAppKey(markLeaf, appId, deploymentId) {
        validateParameters(Array.prototype.slice.apply(arguments).slice(1));
        let key = delimit("appId", appId, /*prependDelimiter=*/ false);
        if (typeof deploymentId !== "undefined") {
            key += delimit("deploymentId", deploymentId);
        }
        // Mark leaf key with a '*', e.g. 'appId 123 deploymentId 456' -> 'appId 123 deploymentId* 456'
        if (markLeaf) {
            const lastIdDelimiter = key.lastIndexOf(DELIMITER);
            key = key.substring(0, lastIdDelimiter) + LEAF_MARKER + key.substring(lastIdDelimiter);
        }
        return key;
    }
    Keys.generateHierarchicalAppKey = generateHierarchicalAppKey;
    function generateHierarchicalAccountKey(markLeaf, accountId, appId) {
        validateParameters(Array.prototype.slice.apply(arguments).slice(1));
        let key = delimit("accountId", accountId, /*prependDelimiter=*/ false);
        if (typeof appId !== "undefined") {
            key += delimit("appId", appId);
        }
        // Mark leaf key with a '*', e.g. 'accountId 123 appId 456' -> 'accountId 123 appId* 456'
        if (markLeaf) {
            const lastIdDelimiter = key.lastIndexOf(DELIMITER);
            key = key.substring(0, lastIdDelimiter) + LEAF_MARKER + key.substring(lastIdDelimiter);
        }
        return key;
    }
    Keys.generateHierarchicalAccountKey = generateHierarchicalAccountKey;
    function getAccessKeyRowKey(accountId, accessKeyId) {
        validateParameters(Array.prototype.slice.apply(arguments));
        let key = "accountId_" + accountId + "_accessKeyId*_";
        if (accessKeyId !== undefined) {
            key += accessKeyId;
        }
        return key;
    }
    Keys.getAccessKeyRowKey = getAccessKeyRowKey;
    function isDeployment(rowKey) {
        return rowKey.indexOf("deploymentId*") !== -1;
    }
    Keys.isDeployment = isDeployment;
    // To prevent a table scan when querying by properties for which we don't have partition information, we create shortcut
    // partitions which hold single entries
    function getEmailShortcutAddress(email) {
        validateParameters(Array.prototype.slice.apply(arguments));
        // We lower-case the email in our storage lookup because Partition/RowKeys are case-sensitive, but in all other cases we leave
        // the email as-is (as a new account with a different casing would be rejected as a duplicate at creation time)
        return {
            partitionKeyPointer: "email" + DELIMITER + email.toLowerCase(),
            rowKeyPointer: "",
        };
    }
    Keys.getEmailShortcutAddress = getEmailShortcutAddress;
    function getShortcutDeploymentKeyPartitionKey(deploymentKey) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return delimit("deploymentKey", deploymentKey, /*prependDelimiter=*/ false);
    }
    Keys.getShortcutDeploymentKeyPartitionKey = getShortcutDeploymentKeyPartitionKey;
    function getShortcutDeploymentKeyRowKey() {
        return "";
    }
    Keys.getShortcutDeploymentKeyRowKey = getShortcutDeploymentKeyRowKey;
    function getShortcutAccessKeyPartitionKey(accessKeyName, hash = true) {
        validateParameters(Array.prototype.slice.apply(arguments));
        return delimit("accessKey", hash ? utils.hashWithSHA256(accessKeyName) : accessKeyName, /*prependDelimiter=*/ false);
    }
    Keys.getShortcutAccessKeyPartitionKey = getShortcutAccessKeyPartitionKey;
    // Last layer of defense against uncaught injection attacks - raise an uncaught exception
    function validateParameters(parameters) {
        parameters.forEach((parameter) => {
            if (parameter && (parameter.indexOf(DELIMITER) >= 0 || parameter.indexOf(LEAF_MARKER) >= 0)) {
                throw storage.storageError(storage.ErrorCode.Invalid, `The parameter '${parameter}' contained invalid characters.`);
            }
        });
    }
    function delimit(fieldName, value, prependDelimiter = true) {
        const prefix = prependDelimiter ? DELIMITER : "";
        return prefix + fieldName + DELIMITER + value;
    }
    //function to mimic defer function in q package
    function defer() {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    }
})(Keys || (Keys = {}));
class AzureStorage {
    static NO_ID_ERROR = "No id set";
    static HISTORY_BLOB_CONTAINER_NAME = "packagehistoryv1";
    static MAX_PACKAGE_HISTORY_LENGTH = 50;
    static TABLE_NAME = "storagev2";
    _tableClient;
    _blobService;
    _setupPromise;
    constructor(accountName, accountKey) {
        shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-");
        this._setupPromise = this.setup(accountName, accountKey);
    }
    reinitialize(accountName, accountKey) {
        console.log("Re-initializing Azure storage");
        return this.setup(accountName, accountKey);
    }
    checkHealth() {
        return new Promise((resolve, reject) => {
            this._setupPromise
                .then(() => {
                const tableCheck = new Promise((tableResolve, tableReject) => {
                    this._tableClient
                        .getEntity(/*partitionKey=*/ "health", /*rowKey=*/ "health")
                        .then((entity) => {
                        if (entity.health !== "health") {
                            tableReject(storage.storageError(storage.ErrorCode.ConnectionFailed, "The Azure Tables service failed the health check"));
                        }
                        else {
                            tableResolve();
                        }
                    })
                        .catch(tableReject);
                });
                const acquisitionBlobCheck = this.blobHealthCheck(AzureStorage.TABLE_NAME);
                const historyBlobCheck = this.blobHealthCheck(AzureStorage.HISTORY_BLOB_CONTAINER_NAME);
                return Promise.all([tableCheck, acquisitionBlobCheck, historyBlobCheck]);
            })
                .then(() => {
                resolve();
            })
                .catch(reject);
        });
    }
    addAccount(account) {
        account = storage.clone(account); // pass by value
        account.id = shortid.generate();
        const hierarchicalAddress = Keys.getAccountAddress(account.id);
        const emailShortcutAddress = Keys.getEmailShortcutAddress(account.email);
        // Store the actual Account in the email partition, and a Pointer in the other partitions
        const accountPointer = Keys.getEmailShortcutAddress(account.email);
        return this._setupPromise
            .then(() => {
            const entity = this.wrap(account, emailShortcutAddress.partitionKeyPointer, emailShortcutAddress.rowKeyPointer);
            return this._tableClient.createEntity(entity); // Successfully fails if duplicate email
        })
            .then(() => {
            const entity = this.wrap(accountPointer, hierarchicalAddress.partitionKeyPointer, hierarchicalAddress.rowKeyPointer);
            return this._tableClient.createEntity(entity);
        })
            .then(() => {
            return account.id;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getAccount(accountId) {
        const address = Keys.getAccountAddress(accountId);
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(address.partitionKeyPointer, address.rowKeyPointer);
        })
            .then((pointer) => {
            if (!pointer) {
                throw new Error(`Account not found for ID: ${accountId}`);
            }
            return this.retrieveByKey(pointer.partitionKeyPointer, pointer.rowKeyPointer);
        })
            .catch((error) => {
            throw AzureStorage.azureErrorHandler(error);
        });
    }
    getUserFromAccessKey(accessKey) {
        //MARK: TODO TEST THIS
        const partitionKey = Keys.getShortcutAccessKeyPartitionKey(accessKey);
        const rowKey = "";
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(partitionKey, rowKey);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getUserFromAccessToken(accessToken) {
        // Create partition key without hashing the token in development mode
        const useHashedKey = process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test";
        const partitionKey = Keys.getShortcutAccessKeyPartitionKey(accessToken, useHashedKey);
        const rowKey = "";
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(partitionKey, rowKey);
        })
            .then(async (accessKeyPointer) => {
            if (!accessKeyPointer) {
                throw new Error("Access key not found");
            }
            return this.getAccount(accessKeyPointer.accountId);
        })
            .catch((error) => {
            console.error("Error retrieving account:", error);
            throw error;
        });
    }
    getAccountByEmail(email) {
        const address = Keys.getEmailShortcutAddress(email);
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(address.partitionKeyPointer, address.rowKeyPointer);
        })
            .catch((azureError) => {
            AzureStorage.azureErrorHandler(azureError, true, "ResourceNotFound", "The specified e-mail address doesn't represent a registered user");
        });
    }
    updateAccount(email, updateProperties) {
        if (!email)
            throw new Error("No account email");
        const address = Keys.getEmailShortcutAddress(email);
        const updates = {
            azureAdId: updateProperties.azureAdId,
            gitHubId: updateProperties.gitHubId,
            microsoftId: updateProperties.microsoftId,
        };
        return this._setupPromise
            .then(() => {
            const entity = this.wrap(updates, address.partitionKeyPointer, address.rowKeyPointer);
            return this._tableClient.updateEntity(entity);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getAccountIdFromAccessKey(accessKey) {
        // Don't hash the key in development mode
        const useHashedKey = process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test";
        const partitionKey = Keys.getShortcutAccessKeyPartitionKey(accessKey, useHashedKey);
        const rowKey = "";
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(partitionKey, rowKey);
        })
            .then((accountIdObject) => {
            if (!accountIdObject) {
                throw storage.storageError(storage.ErrorCode.NotFound, "Access key not found");
            }
            if (new Date().getTime() >= accountIdObject.expires) {
                throw storage.storageError(storage.ErrorCode.Expired, "The access key has expired.");
            }
            return accountIdObject.accountId;
        })
            .catch((error) => {
            throw AzureStorage.azureErrorHandler(error);
        });
    }
    getTenants(accountId) {
        return this._setupPromise
            .then(() => {
            return this.getAccount(accountId);
        })
            .then((account) => {
            return [];
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    removeTenant(accountId, tenantId) {
        return Promise.resolve(null);
    }
    addApp(accountId, app) {
        app = storage.clone(app); // pass by value
        app.id = shortid.generate();
        return this._setupPromise
            .then(() => {
            return this.getAccount(accountId);
        })
            .then((account) => {
            const collabMap = {};
            collabMap[account.email] = { accountId: accountId, permission: storage.Permissions.Owner };
            app.collaborators = collabMap;
            const flatApp = AzureStorage.flattenApp(app, /*updateCollaborator*/ true);
            return this.insertByAppHierarchy(flatApp, app.id);
        })
            .then(() => {
            return this.addAppPointer(accountId, app.id);
        })
            .then(() => {
            return app;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getApps(accountId) {
        return this._setupPromise
            .then(() => {
            return this.getCollectionByHierarchy(accountId);
        })
            .then((flatApps) => {
            const apps = flatApps.map((flatApp) => {
                return AzureStorage.unflattenApp(flatApp, accountId);
            });
            return apps;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getApp(accountId, appId, keepCollaboratorIds = false) {
        return this._setupPromise
            .then(() => {
            return this.retrieveByAppHierarchy(appId);
        })
            .then((flatApp) => {
            return AzureStorage.unflattenApp(flatApp, accountId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    removeApp(accountId, appId) {
        // remove entries for all collaborators account before removing the app
        return this._setupPromise
            .then(() => {
            return this.removeAllCollaboratorsAppPointers(accountId, appId);
        })
            .then(() => {
            return this.cleanUpByAppHierarchy(appId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    updateApp(accountId, app) {
        const appId = app.id;
        if (!appId)
            throw new Error("No app id");
        return this._setupPromise
            .then(() => {
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ false);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    transferApp(accountId, appId, email) {
        let app;
        let targetCollaboratorAccountId;
        let requestingCollaboratorEmail;
        let isTargetAlreadyCollaborator;
        return this._setupPromise
            .then(() => {
            const getAppPromise = this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
            const accountPromise = this.getAccountByEmail(email);
            return Promise.all([getAppPromise, accountPromise]);
        })
            .then(([appPromiseResult, accountPromiseResult]) => {
            targetCollaboratorAccountId = accountPromiseResult.id;
            email = accountPromiseResult.email; // Use the original email stored on the account to ensure casing is consistent
            app = appPromiseResult;
            requestingCollaboratorEmail = AzureStorage.getEmailForAccountId(app.collaborators, accountId);
            if (requestingCollaboratorEmail === email) {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, "The given account already owns the app.");
            }
            return this.getApps(targetCollaboratorAccountId);
        })
            .then((appsForCollaborator) => {
            if (storage.NameResolver.isDuplicate(appsForCollaborator, app.name)) {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, 'Cannot transfer ownership. An app with name "' + app.name + '" already exists for the given collaborator.');
            }
            isTargetAlreadyCollaborator = AzureStorage.isCollaborator(app.collaborators, email);
            // Update the current owner to be a collaborator
            AzureStorage.setCollaboratorPermission(app.collaborators, requestingCollaboratorEmail, storage.Permissions.Collaborator);
            // set target collaborator as an owner.
            if (isTargetAlreadyCollaborator) {
                AzureStorage.setCollaboratorPermission(app.collaborators, email, storage.Permissions.Owner);
            }
            else {
                const targetOwnerProperties = {
                    accountId: targetCollaboratorAccountId,
                    permission: storage.Permissions.Owner,
                };
                AzureStorage.addToCollaborators(app.collaborators, email, targetOwnerProperties);
            }
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true);
        })
            .then(() => {
            if (!isTargetAlreadyCollaborator) {
                // Added a new collaborator as owner to the app, create a corresponding entry for app in target collaborator's account.
                return this.addAppPointer(targetCollaboratorAccountId, app.id);
            }
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    addCollaborator(accountId, appId, email) {
        return this._setupPromise
            .then(() => {
            const getAppPromise = this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
            const accountPromise = this.getAccountByEmail(email);
            return Promise.all([getAppPromise, accountPromise]);
        })
            .then(([app, account]) => {
            // Use the original email stored on the account to ensure casing is consistent
            email = account.email;
            return this.addCollaboratorWithPermissions(accountId, app, email, {
                accountId: account.id,
                permission: storage.Permissions.Collaborator,
            });
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getCollaborators(accountId, appId) {
        return this._setupPromise
            .then(() => {
            return this.getApp(accountId, appId, /*keepCollaboratorIds*/ false);
        })
            .then((app) => {
            return Promise.resolve((app.collaborators));
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    updateCollaborators(accountId, appId, email, role) {
        //MARK: TODO TEST
        return this._setupPromise
            .then(() => {
            return this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
        })
            .then((app) => {
            const collaboratorEmails = Object.keys(app.collaborators);
            collaboratorEmails.forEach((email) => {
                const collaboratorProperties = app.collaborators[email];
                collaboratorProperties.permission = role;
            });
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    removeCollaborator(accountId, appId, email) {
        return this._setupPromise
            .then(() => {
            return this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
        })
            .then((app) => {
            const removedCollabProperties = app.collaborators[email];
            if (!removedCollabProperties) {
                throw storage.storageError(storage.ErrorCode.NotFound, "The given email is not a collaborator for this app.");
            }
            if (!AzureStorage.isOwner(app.collaborators, email)) {
                delete app.collaborators[email];
            }
            else {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, "Cannot remove the owner of the app from collaborator list.");
            }
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true).then(() => {
                return this.removeAppPointer(removedCollabProperties.accountId, app.id);
            });
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    addDeployment(accountId, appId, deployment) {
        let deploymentId;
        return this._setupPromise
            .then(() => {
            const flatDeployment = AzureStorage.flattenDeployment(deployment);
            flatDeployment.id = shortid.generate();
            return this.insertByAppHierarchy(flatDeployment, appId, flatDeployment.id);
        })
            .then((returnedId) => {
            deploymentId = returnedId;
            return this.uploadToHistoryBlob(deploymentId, JSON.stringify([]));
        })
            .then(() => {
            const shortcutPartitionKey = Keys.getShortcutDeploymentKeyPartitionKey(deployment.key);
            const shortcutRowKey = Keys.getShortcutDeploymentKeyRowKey();
            const pointer = {
                appId: appId,
                deploymentId: deploymentId,
            };
            const entity = this.wrap(pointer, shortcutPartitionKey, shortcutRowKey);
            return this._tableClient.createEntity(entity);
        })
            .then(() => {
            return deploymentId;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getDeploymentInfo(deploymentKey) {
        const partitionKey = Keys.getShortcutDeploymentKeyPartitionKey(deploymentKey);
        const rowKey = Keys.getShortcutDeploymentKeyRowKey();
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(partitionKey, rowKey);
        })
            .then((pointer) => {
            if (!pointer) {
                return null;
            }
            return { appId: pointer.appId, deploymentId: pointer.deploymentId };
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getPackageHistoryFromDeploymentKey(deploymentKey) {
        const pointerPartitionKey = Keys.getShortcutDeploymentKeyPartitionKey(deploymentKey);
        const pointerRowKey = Keys.getShortcutDeploymentKeyRowKey();
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(pointerPartitionKey, pointerRowKey);
        })
            .then((pointer) => {
            if (!pointer)
                return null;
            return this.getPackageHistoryFromBlob(pointer.deploymentId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getDeployment(accountId, appId, deploymentId) {
        return this._setupPromise
            .then(() => {
            return this.retrieveByAppHierarchy(appId, deploymentId);
        })
            .then((flatDeployment) => {
            return AzureStorage.unflattenDeployment(flatDeployment);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getDeployments(accountId, appId) {
        return this._setupPromise
            .then(() => {
            return this.getCollectionByHierarchy(accountId, appId);
        })
            .then((flatDeployments) => {
            const deployments = [];
            flatDeployments.forEach((flatDeployment) => {
                deployments.push(AzureStorage.unflattenDeployment(flatDeployment));
            });
            return deployments;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    removeDeployment(accountId, appId, deploymentId) {
        return this._setupPromise
            .then(() => {
            return this.cleanUpByAppHierarchy(appId, deploymentId);
        })
            .then(() => {
            return this.deleteHistoryBlob(deploymentId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    updateDeployment(accountId, appId, deployment) {
        const deploymentId = deployment.id;
        if (!deploymentId)
            throw new Error("No deployment id");
        return this._setupPromise
            .then(() => {
            const flatDeployment = AzureStorage.flattenDeployment(deployment);
            return this.mergeByAppHierarchy(flatDeployment, appId, deploymentId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    commitPackage(accountId, appId, deploymentId, appPackage) {
        if (!deploymentId)
            throw new Error("No deployment id");
        if (!appPackage)
            throw new Error("No package specified");
        appPackage = storage.clone(appPackage); // pass by value
        let packageHistory;
        return this._setupPromise
            .then(() => {
            return this.getPackageHistoryFromBlob(deploymentId);
        })
            .then((history) => {
            packageHistory = history;
            appPackage.label = this.getNextLabel(packageHistory);
            return this.getAccount(accountId);
        })
            .then((account) => {
            appPackage.releasedBy = account.email;
            // Remove the rollout value for the last package.
            const lastPackage = packageHistory && packageHistory.length ? packageHistory[packageHistory.length - 1] : null;
            if (lastPackage) {
                lastPackage.rollout = null;
            }
            packageHistory.push(appPackage);
            if (packageHistory.length > AzureStorage.MAX_PACKAGE_HISTORY_LENGTH) {
                packageHistory.splice(0, packageHistory.length - AzureStorage.MAX_PACKAGE_HISTORY_LENGTH);
            }
            const flatPackage = { id: deploymentId, package: JSON.stringify(appPackage) };
            return this.mergeByAppHierarchy(flatPackage, appId, deploymentId);
        })
            .then(() => {
            return this.uploadToHistoryBlob(deploymentId, JSON.stringify(packageHistory));
        })
            .then(() => {
            return appPackage;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    clearPackageHistory(accountId, appId, deploymentId) {
        return this._setupPromise
            .then(() => {
            return this.retrieveByAppHierarchy(appId, deploymentId);
        })
            .then((flatDeployment) => {
            delete flatDeployment.package;
            return this.updateByAppHierarchy(flatDeployment, appId, deploymentId);
        })
            .then(() => {
            return this.uploadToHistoryBlob(deploymentId, JSON.stringify([]));
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getPackageHistory(accountId, appId, deploymentId) {
        return this._setupPromise
            .then(() => {
            return this.getPackageHistoryFromBlob(deploymentId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    updatePackageHistory(accountId, appId, deploymentId, history) {
        // If history is null or empty array we do not update the package history, use clearPackageHistory for that.
        if (!history || !history.length) {
            throw storage.storageError(storage.ErrorCode.Invalid, "Cannot clear package history from an update operation");
        }
        return this._setupPromise
            .then(() => {
            const flatDeployment = { id: deploymentId, package: JSON.stringify(history[history.length - 1]) };
            return this.mergeByAppHierarchy(flatDeployment, appId, deploymentId);
        })
            .then(() => {
            return this.uploadToHistoryBlob(deploymentId, JSON.stringify(history));
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    addBlob(blobId, stream, streamLength) {
        return this._setupPromise
            .then(() => {
            return utils.streamToBuffer(stream);
        })
            .then((buffer) => {
            return this._blobService.getContainerClient(AzureStorage.TABLE_NAME).uploadBlockBlob(blobId, buffer, buffer.byteLength);
        })
            .then(() => {
            return blobId;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getBlobUrl(blobId) {
        return this._setupPromise
            .then(() => {
            return this._blobService.getContainerClient(AzureStorage.TABLE_NAME).getBlobClient(blobId).url;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    removeBlob(blobId) {
        return this._setupPromise
            .then(() => {
            return this._blobService.getContainerClient(AzureStorage.TABLE_NAME).deleteBlob(blobId);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    addAccessKey(accountId, accessKey) {
        accessKey = storage.clone(accessKey); // pass by value
        accessKey.id = shortid.generate();
        return this._setupPromise
            .then(() => {
            const partitionKey = Keys.getShortcutAccessKeyPartitionKey(accessKey.name);
            const rowKey = "";
            const accessKeyPointer = { accountId, expires: accessKey.expires };
            const accessKeyPointerEntity = this.wrap(accessKeyPointer, partitionKey, rowKey);
            return this._tableClient.createEntity(accessKeyPointerEntity);
        })
            .then(() => {
            return this.insertAccessKey(accessKey, accountId);
        })
            .then(() => {
            return accessKey.id;
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getAccessKey(accountId, accessKeyId) {
        const partitionKey = Keys.getAccountPartitionKey(accountId);
        const rowKey = Keys.getAccessKeyRowKey(accountId, accessKeyId);
        return this._setupPromise
            .then(() => {
            return this.retrieveByKey(partitionKey, rowKey);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    getAccessKeys(accountId) {
        const deferred = (0, aws_storage_1.defer)();
        const partitionKey = Keys.getAccountPartitionKey(accountId);
        const rowKey = Keys.getHierarchicalAccountRowKey(accountId);
        const searchKey = Keys.getAccessKeyRowKey(accountId);
        // Fetch both the parent account (for error-checking purposes) and the access tokens
        const query = `PartitionKey eq '${partitionKey}' and (RowKey eq '${rowKey}' or (RowKey gt '${searchKey}' and RowKey lt '${searchKey}~'))`;
        const options = { queryOptions: { filter: query } };
        this._setupPromise.then(() => {
            this._tableClient
                .listEntities(options)
                .byPage()
                .next()
                .then((response) => {
                const entities = response.value;
                if (entities.length === 0) {
                    // Reject as 'not found' if we can't even find the parent entity
                    throw storage.storageError(storage.ErrorCode.NotFound);
                }
                const objects = [];
                entities.forEach((entity) => {
                    // Don't include the account
                    if (entity.rowKey !== rowKey) {
                        objects.push(this.unwrap(entity));
                    }
                });
                deferred.resolve(objects);
            })
                .catch((error) => {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    }
    removeAccessKey(accountId, accessKeyId) {
        return this._setupPromise
            .then(() => {
            return this.getAccessKey(accountId, accessKeyId);
        })
            .then((accessKey) => {
            const partitionKey = Keys.getAccountPartitionKey(accountId);
            const rowKey = Keys.getAccessKeyRowKey(accountId, accessKeyId);
            const shortcutAccessKeyPartitionKey = Keys.getShortcutAccessKeyPartitionKey(accessKey.name, false);
            return Promise.all([
                this._tableClient.deleteEntity(partitionKey, rowKey),
                this._tableClient.deleteEntity(shortcutAccessKeyPartitionKey, ""),
            ]);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    updateAccessKey(accountId, accessKey) {
        if (!accessKey) {
            throw new Error("No access key");
        }
        if (!accessKey.id) {
            throw new Error("No access key id");
        }
        const partitionKey = Keys.getAccountPartitionKey(accountId);
        const rowKey = Keys.getAccessKeyRowKey(accountId, accessKey.id);
        return this._setupPromise
            .then(() => {
            const entity = this.wrap(accessKey, partitionKey, rowKey);
            return this._tableClient.updateEntity(entity);
        })
            .then(() => {
            const newAccessKeyPointer = {
                accountId,
                expires: accessKey.expires,
            };
            const accessKeyPointerEntity = this.wrap(newAccessKeyPointer, Keys.getShortcutAccessKeyPartitionKey(accessKey.name, false), "");
            return this._tableClient.updateEntity(accessKeyPointerEntity);
        })
            .catch(AzureStorage.azureErrorHandler);
    }
    // No-op for safety, so that we don't drop the wrong db, pending a cleaner solution for removing test data.
    dropAll() {
        return Promise.resolve(null);
    }
    isAccessKeyValid(accessKey) {
        return this.getAccountIdFromAccessKey(accessKey)
            .then(() => true)
            .catch(error => {
            if (error.code === "Expired") {
                return false;
            }
            return false;
        });
    }
    setup(accountName, accountKey) {
        let tableServiceClient;
        let tableClient;
        let blobServiceClient;
        if (process.env.EMULATED) {
            const devConnectionString = "UseDevelopmentStorage=true";
            tableServiceClient = data_tables_1.TableServiceClient.fromConnectionString(devConnectionString);
            tableClient = data_tables_1.TableClient.fromConnectionString(devConnectionString, AzureStorage.TABLE_NAME);
            blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(devConnectionString);
        }
        else {
            if ((!accountName && !process.env.AZURE_STORAGE_ACCOUNT) || (!accountKey && !process.env.AZURE_STORAGE_ACCESS_KEY)) {
                throw new Error("Azure credentials not set");
            }
            const _accountName = accountName ?? process.env.AZURE_STORAGE_ACCOUNT;
            const _accountKey = accountKey ?? process.env.AZURE_STORAGE_ACCESS_KEY;
            const tableStorageCredential = new data_tables_1.AzureNamedKeyCredential(_accountName, _accountKey);
            const blobStorageCredential = new storage_blob_1.StorageSharedKeyCredential(_accountName, _accountKey);
            const tableServiceUrl = `https://${_accountName}.table.core.windows.net`;
            const blobServiceUrl = `https://${_accountName}.blob.core.windows.net`;
            tableServiceClient = new data_tables_1.TableServiceClient(tableServiceUrl, tableStorageCredential, {
                retryOptions: {
                    maxRetries: 3,
                    maxRetryDelayInMs: 2000,
                    retryDelayInMs: 500,
                },
            });
            tableClient = new data_tables_1.TableClient(tableServiceUrl, AzureStorage.TABLE_NAME, tableStorageCredential);
            blobServiceClient = new storage_blob_1.BlobServiceClient(blobServiceUrl, blobStorageCredential, {
                retryOptions: {
                    maxTries: 4,
                    maxRetryDelayInMs: 2000,
                    retryDelayInMs: 500,
                },
            });
        }
        const tableHealthEntity = this.wrap({ health: "health" }, /*partitionKey=*/ "health", /*rowKey=*/ "health");
        return Promise
            .all([
            tableServiceClient.createTable(AzureStorage.TABLE_NAME),
            blobServiceClient.createContainer(AzureStorage.TABLE_NAME, { access: "blob" }),
            blobServiceClient.createContainer(AzureStorage.HISTORY_BLOB_CONTAINER_NAME),
        ])
            .then(() => {
            return Promise.all([
                tableClient.createEntity(tableHealthEntity),
                blobServiceClient.getContainerClient(AzureStorage.TABLE_NAME).uploadBlockBlob("health", "health", "health".length),
                blobServiceClient
                    .getContainerClient(AzureStorage.HISTORY_BLOB_CONTAINER_NAME)
                    .uploadBlockBlob("health", "health", "health".length),
            ]);
        })
            .then(() => {
            // Do not assign these unless everything completes successfully, as this will cause in-flight promise chains to start using
            // the initialized services
            this._tableClient = tableClient;
            this._blobService = blobServiceClient;
        })
            .catch((error) => {
            if (error.code === "ContainerAlreadyExists") {
                this._tableClient = tableClient;
                this._blobService = blobServiceClient;
            }
            else {
                throw error;
            }
        });
    }
    blobHealthCheck(container) {
        const deferred = (0, aws_storage_1.defer)();
        this._blobService
            .getContainerClient(container)
            .getBlobClient("health")
            .downloadToBuffer()
            .then((blobContents) => {
            if (blobContents.toString() !== "health") {
                deferred.reject(storage.storageError(storage.ErrorCode.ConnectionFailed, "The Azure Blobs service failed the health check for " + container));
            }
            else {
                deferred.resolve();
            }
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    getPackageHistoryFromBlob(blobId) {
        const deferred = (0, aws_storage_1.defer)();
        this._blobService
            .getContainerClient(AzureStorage.HISTORY_BLOB_CONTAINER_NAME)
            .getBlobClient(blobId)
            .downloadToBuffer()
            .then((blobContents) => {
            const parsedContents = JSON.parse(blobContents.toString());
            deferred.resolve(parsedContents);
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    uploadToHistoryBlob(blobId, content) {
        const deferred = (0, aws_storage_1.defer)();
        this._blobService
            .getContainerClient(AzureStorage.HISTORY_BLOB_CONTAINER_NAME)
            .uploadBlockBlob(blobId, content, content.length)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    deleteHistoryBlob(blobId) {
        const deferred = (0, aws_storage_1.defer)();
        this._blobService
            .getContainerClient(AzureStorage.HISTORY_BLOB_CONTAINER_NAME)
            .deleteBlob(blobId)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    wrap(jsObject, partitionKey, rowKey) {
        return {
            partitionKey,
            rowKey,
            ...jsObject,
        };
    }
    unwrap(entity, includeKey) {
        const { partitionKey, rowKey, etag, timestamp, createdTime, ...rest } = entity;
        let unwrapped = includeKey ? { partitionKey, rowKey, ...rest } : rest;
        if (typeof createdTime === "bigint") {
            unwrapped = { ...unwrapped, createdTime: Number(createdTime) };
        }
        return unwrapped;
    }
    addCollaboratorWithPermissions(accountId, app, email, collabProperties) {
        if (app && app.collaborators && !app.collaborators[email]) {
            app.collaborators[email] = collabProperties;
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true).then(() => {
                return this.addAppPointer(collabProperties.accountId, app.id);
            });
        }
        else {
            throw storage.storageError(storage.ErrorCode.AlreadyExists, "The given account is already a collaborator for this app.");
        }
    }
    addAppPointer(accountId, appId) {
        const deferred = (0, aws_storage_1.defer)();
        const appPartitionKey = Keys.getAppPartitionKey(appId);
        const appRowKey = Keys.getHierarchicalAppRowKey(appId);
        const pointer = { partitionKeyPointer: appPartitionKey, rowKeyPointer: appRowKey };
        const accountPartitionKey = Keys.getAccountPartitionKey(accountId);
        const accountRowKey = Keys.getHierarchicalAccountRowKey(accountId, appId);
        const entity = this.wrap(pointer, accountPartitionKey, accountRowKey);
        this._tableClient
            .createEntity(entity)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    removeAppPointer(accountId, appId) {
        const deferred = (0, aws_storage_1.defer)();
        const accountPartitionKey = Keys.getAccountPartitionKey(accountId);
        const accountRowKey = Keys.getHierarchicalAccountRowKey(accountId, appId);
        this._tableClient
            .deleteEntity(accountPartitionKey, accountRowKey)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    removeAllCollaboratorsAppPointers(accountId, appId) {
        return this.getApp(accountId, appId, /*keepCollaboratorIds*/ true)
            .then((app) => {
            const collaboratorMap = app.collaborators;
            const requesterEmail = AzureStorage.getEmailForAccountId(collaboratorMap, accountId);
            const removalPromises = [];
            Object.keys(collaboratorMap).forEach((key) => {
                const collabProperties = collaboratorMap[key];
                removalPromises.push(this.removeAppPointer(collabProperties.accountId, app.id));
            });
            return Promise.allSettled(removalPromises);
        })
            .then(() => { });
    }
    updateAppWithPermission(accountId, app, updateCollaborator = false) {
        const appId = app.id;
        if (!appId)
            throw new Error("No app id");
        const flatApp = AzureStorage.flattenApp(app, updateCollaborator);
        return this.mergeByAppHierarchy(flatApp, appId);
    }
    insertByAppHierarchy(jsObject, appId, deploymentId) {
        const leafId = arguments[arguments.length - 1];
        const appPartitionKey = Keys.getAppPartitionKey(appId);
        const args = Array.prototype.slice.call(arguments);
        args.shift(); // Remove 'jsObject' argument
        args.pop(); // Remove the leaf id
        // Check for existence of the parent before inserting
        let fetchParentPromise = Promise.resolve(null);
        if (args.length > 0) {
            const parentRowKey = Keys.getHierarchicalAppRowKey.apply(null, args);
            fetchParentPromise = this._tableClient.getEntity(appPartitionKey, parentRowKey);
        }
        return fetchParentPromise
            .then(() => {
            // We need Pointer object to create partitionKeyPointer and rowKeyPointer fields in our table
            const appRowKey = Keys.getHierarchicalAppRowKey(appId, deploymentId);
            const pointer = { partitionKeyPointer: appPartitionKey, rowKeyPointer: appRowKey };
            const entity = this.wrap(jsObject, pointer.partitionKeyPointer, pointer.rowKeyPointer);
            return this._tableClient.createEntity(entity);
        })
            .then(() => {
            return leafId;
        });
    }
    insertAccessKey(accessKey, accountId) {
        accessKey = storage.clone(accessKey);
        accessKey.name = utils.hashWithSHA256(accessKey.name);
        const deferred = (0, aws_storage_1.defer)();
        const partitionKey = Keys.getAccountPartitionKey(accountId);
        const rowKey = Keys.getAccessKeyRowKey(accountId, accessKey.id);
        const entity = this.wrap(accessKey, partitionKey, rowKey);
        this._tableClient
            .createEntity(entity)
            .then(() => {
            deferred.resolve(accessKey.id);
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    retrieveByKey(partitionKey, rowKey) {
        return this._tableClient.getEntity(partitionKey, rowKey).then((result) => {
            return this.unwrap(result);
        }, (error) => {
            if (error && error.statusCode === 404) {
                return null;
            }
            throw error;
        });
    }
    retrieveByAppHierarchy(appId, deploymentId) {
        const partitionKey = Keys.getAppPartitionKey(appId);
        const rowKey = Keys.getHierarchicalAppRowKey(appId, deploymentId);
        return this.retrieveByKey(partitionKey, rowKey);
    }
    async getLeafEntities(query, childrenSearchKey) {
        const finalEntries = [];
        const promises = [];
        for await (const entity of this._tableClient.listEntities({
            queryOptions: { filter: query },
        })) {
            if (entity.partitionKeyPointer && entity.partitionKeyPointer !== "" && entity.rowKeyPointer && entity.rowKeyPointer !== "") {
                const childQuery = (0, data_tables_1.odata) `PartitionKey eq ${entity.partitionKeyPointer} and (RowKey eq ${entity.rowKeyPointer} or (RowKey gt ${childrenSearchKey} and RowKey lt ${childrenSearchKey + "~"}))`;
                promises.push(this.getLeafEntities(childQuery, childrenSearchKey));
            }
            else {
                finalEntries.push(entity);
            }
        }
        if (promises.length > 0) {
            const results = await Promise.all(promises);
            results.forEach((value) => {
                if (value.length > 0) {
                    finalEntries.push(...value);
                }
            });
            return finalEntries;
        }
        else {
            return finalEntries;
        }
    }
    async getCollectionByHierarchy(accountId, appId, deploymentId) {
        let partitionKey;
        let rowKey;
        let childrenSearchKey;
        // Construct a search key that fetches only the direct children at the given hierarchical location
        const searchKeyArgs = Array.prototype.slice.call(arguments);
        searchKeyArgs.unshift(/*markLeaf=*/ true);
        searchKeyArgs.push(/*leafId=*/ "");
        if (appId) {
            searchKeyArgs.splice(1, 1); // remove accountId
            partitionKey = Keys.getAppPartitionKey(appId);
            rowKey = Keys.getHierarchicalAppRowKey(appId, deploymentId);
            childrenSearchKey = Keys.generateHierarchicalAppKey.apply(null, searchKeyArgs);
        }
        else {
            partitionKey = Keys.getAccountPartitionKey(accountId);
            rowKey = Keys.getHierarchicalAccountRowKey(accountId);
            childrenSearchKey = Keys.generateHierarchicalAccountKey.apply(null, searchKeyArgs);
        }
        // Fetch both the parent (for error-checking purposes) and the direct children
        const query = (0, data_tables_1.odata) `PartitionKey eq ${partitionKey} and (RowKey eq ${rowKey} or (RowKey gt ${childrenSearchKey} and RowKey lt ${childrenSearchKey + "~"}))`;
        const entities = await this.getLeafEntities(query, childrenSearchKey);
        if (entities.length === 0) {
            // Reject as 'not found' if we can't even find the parent entity
            throw new Error("Entity not found");
        }
        const objects = [];
        entities.forEach((entity) => {
            // Don't include the parent
            if (entity.rowKey !== rowKey) {
                objects.push(this.unwrap(entity));
            }
        });
        return objects;
    }
    async cleanUpByAppHierarchy(appId, deploymentId) {
        const partitionKey = Keys.getAppPartitionKey(appId);
        const rowKey = Keys.getHierarchicalAppRowKey(appId, deploymentId);
        const descendantsSearchKey = Keys.generateHierarchicalAppKey(/*markLeaf=*/ false, appId, deploymentId);
        const tableBatch = [];
        const query = (0, data_tables_1.odata) `PartitionKey eq '${partitionKey}' and (RowKey eq '${rowKey}' or (RowKey ge '${descendantsSearchKey}' and RowKey lt '${descendantsSearchKey}~'))`;
        for await (const entity of this._tableClient.listEntities({
            queryOptions: { filter: query },
        })) {
            tableBatch.push(["delete", entity]);
        }
        if (tableBatch.length > 0) {
            this._tableClient.submitTransaction(tableBatch);
        }
    }
    getEntityByAppHierarchy(jsObject, appId, deploymentId) {
        const partitionKey = Keys.getAppPartitionKey(appId);
        const rowKey = Keys.getHierarchicalAppRowKey(appId, deploymentId);
        return this.wrap(jsObject, partitionKey, rowKey);
    }
    mergeByAppHierarchy(jsObject, appId, deploymentId) {
        const deferred = (0, aws_storage_1.defer)();
        const entity = this.getEntityByAppHierarchy(jsObject, appId, deploymentId);
        this._tableClient
            .updateEntity(entity)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    updateByAppHierarchy(jsObject, appId, deploymentId) {
        const deferred = (0, aws_storage_1.defer)();
        const entity = this.getEntityByAppHierarchy(jsObject, appId, deploymentId);
        this._tableClient
            .updateEntity(entity)
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    getNextLabel(packageHistory) {
        if (packageHistory.length === 0) {
            return "v1";
        }
        const lastLabel = packageHistory[packageHistory.length - 1].label;
        const lastVersion = parseInt(lastLabel.substring(1)); // Trim 'v' from the front
        return "v" + (lastVersion + 1);
    }
    static deleteIsCurrentAccountProperty(map) {
        if (map) {
            Object.keys(map).forEach((key) => {
                delete map[key].isCurrentAccount;
            });
        }
    }
    static flattenApp(app, updateCollaborator = false) {
        if (!app) {
            return app;
        }
        const flatApp = {};
        for (const property in app) {
            if (property === "collaborators" && updateCollaborator) {
                AzureStorage.deleteIsCurrentAccountProperty(app.collaborators);
                flatApp[property] = JSON.stringify(app[property]);
            }
            else if (property !== "collaborators") {
                // No-op updates on these properties
                flatApp[property] = app[property];
            }
        }
        return flatApp;
    }
    // Note: This does not copy the object before unflattening it
    static unflattenApp(flatApp, currentAccountId) {
        flatApp.collaborators = flatApp.collaborators ? JSON.parse(flatApp.collaborators) : {};
        const currentUserEmail = AzureStorage.getEmailForAccountId(flatApp.collaborators, currentAccountId);
        if (currentUserEmail && flatApp.collaborators[currentUserEmail]) {
            flatApp.collaborators[currentUserEmail].isCurrentAccount = true;
        }
        return flatApp;
    }
    static flattenDeployment(deployment) {
        if (!deployment) {
            return deployment;
        }
        const flatDeployment = {};
        for (const property in deployment) {
            if (property !== "package") {
                // No-op updates on these properties
                flatDeployment[property] = deployment[property];
            }
        }
        return flatDeployment;
    }
    // Note: This does not copy the object before unflattening it
    static unflattenDeployment(flatDeployment) {
        delete flatDeployment.packageHistory;
        flatDeployment.package = flatDeployment.package ? JSON.parse(flatDeployment.package) : null;
        return flatDeployment;
    }
    static isOwner(collaboratorsMap, email) {
        return (collaboratorsMap &&
            email &&
            collaboratorsMap[email] &&
            collaboratorsMap[email].permission === storage.Permissions.Owner);
    }
    static isCollaborator(collaboratorsMap, email) {
        return (collaboratorsMap &&
            email &&
            collaboratorsMap[email] &&
            collaboratorsMap[email].permission === storage.Permissions.Collaborator);
    }
    static setCollaboratorPermission(collaboratorsMap, email, permission) {
        if (collaboratorsMap && email && !(0, storage_1.isPrototypePollutionKey)(email) && collaboratorsMap[email]) {
            collaboratorsMap[email].permission = permission;
        }
    }
    static addToCollaborators(collaboratorsMap, email, collabProps) {
        if (collaboratorsMap && email && !(0, storage_1.isPrototypePollutionKey)(email) && !collaboratorsMap[email]) {
            collaboratorsMap[email] = collabProps;
        }
    }
    static getEmailForAccountId(collaboratorsMap, accountId) {
        if (collaboratorsMap) {
            for (const email of Object.keys(collaboratorsMap)) {
                if (collaboratorsMap[email].accountId === accountId) {
                    return email;
                }
            }
        }
        return null;
    }
    static azureErrorHandler(azureError, overrideMessage = false, overrideCondition, overrideValue) {
        let errorCodeRaw;
        let errorMessage;
        try {
            const parsedMessage = JSON.parse(azureError.message);
            errorCodeRaw = parsedMessage["odata.error"].code;
            errorMessage = parsedMessage["odata.error"].message.value;
        }
        catch (error) {
            errorCodeRaw = azureError.code;
            errorMessage = azureError.message;
        }
        if (overrideMessage && overrideCondition === errorCodeRaw) {
            errorMessage = overrideValue;
        }
        if (typeof errorCodeRaw === "number") {
            // This is a storage.Error that we previously threw; just re-throw it
            throw azureError;
        }
        let errorCode;
        switch (errorCodeRaw) {
            case "BlobNotFound":
            case "ResourceNotFound":
            case "TableNotFound":
                errorCode = storage.ErrorCode.NotFound;
                break;
            case "EntityAlreadyExists":
            case "TableAlreadyExists":
                errorCode = storage.ErrorCode.AlreadyExists;
                break;
            case "EntityTooLarge":
            case "PropertyValueTooLarge":
                errorCode = storage.ErrorCode.TooLarge;
                break;
            case "ETIMEDOUT":
            case "ESOCKETTIMEDOUT":
            case "ECONNRESET":
                // This is an error emitted from the 'request' module, which is a
                // dependency of 'azure-storage', and indicates failure after multiple
                // retries.
                errorCode = storage.ErrorCode.ConnectionFailed;
                break;
            default:
                errorCode = storage.ErrorCode.Other;
                break;
        }
        throw storage.storageError(errorCode, errorMessage);
    }
}
exports.AzureStorage = AzureStorage;

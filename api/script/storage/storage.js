"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameResolver = exports.Permissions = exports.ReleaseMethod = exports.ErrorCode = void 0;
exports.clone = clone;
exports.isOwnedByCurrentUser = isOwnedByCurrentUser;
exports.getOwnerEmail = getOwnerEmail;
exports.isPrototypePollutionKey = isPrototypePollutionKey;
exports.storageError = storageError;
const error = __importStar(require("../error"));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["ConnectionFailed"] = 0] = "ConnectionFailed";
    ErrorCode[ErrorCode["NotFound"] = 1] = "NotFound";
    ErrorCode[ErrorCode["AlreadyExists"] = 2] = "AlreadyExists";
    ErrorCode[ErrorCode["TooLarge"] = 3] = "TooLarge";
    ErrorCode[ErrorCode["Expired"] = 4] = "Expired";
    ErrorCode[ErrorCode["Invalid"] = 5] = "Invalid";
    ErrorCode[ErrorCode["Other"] = 99] = "Other";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// Human-readable strings
var ReleaseMethod;
(function (ReleaseMethod) {
    ReleaseMethod.Upload = "Upload";
    ReleaseMethod.Promote = "Promote";
    ReleaseMethod.Rollback = "Rollback";
})(ReleaseMethod || (exports.ReleaseMethod = ReleaseMethod = {}));
var Permissions;
(function (Permissions) {
    Permissions.Owner = "Owner";
    Permissions.Collaborator = "Collaborator";
})(Permissions || (exports.Permissions = Permissions = {}));
function clone(source) {
    if (!source) {
        return source;
    }
    return JSON.parse(JSON.stringify(source));
}
function isOwnedByCurrentUser(app) {
    for (const email in app.collaborators) {
        const collaborator = app.collaborators[email];
        if (collaborator.isCurrentAccount && collaborator.permission === Permissions.Owner) {
            return true;
        }
    }
    return false;
}
function getOwnerEmail(app) {
    for (const email in app.collaborators) {
        if (app.collaborators[email].permission === Permissions.Owner) {
            return email;
        }
    }
    return null;
}
function isPrototypePollutionKey(key) {
    return ['__proto__', 'constructor', 'prototype'].includes(key);
}
function storageError(errorCode, message) {
    const storageError = error.codePushError(error.ErrorSource.Storage, message);
    storageError.code = errorCode;
    return storageError;
}
// A convenience wrapper on top of any storage implementation to resolve names instead of ID's
class NameResolver {
    constructor(storage) {
        this._storage = storage;
    }
    // Definition
    static isDuplicate(items, name) {
        if (!items.length)
            return false;
        if (items[0].collaborators) {
            // Use 'app' overload
            for (let i = 0; i < items.length; i++) {
                const app = items[i];
                if (app.name === name && isOwnedByCurrentUser(app))
                    return true;
            }
            return false;
        }
        else {
            // Use general overload
            return !!NameResolver.findByName(items, name);
        }
    }
    // Definition
    static isDuplicateApp(items, appRequest) {
        if (!items.length)
            return false;
        if (items[0].collaborators) {
            // Use 'app' overload
            for (let i = 0; i < items.length; i++) {
                const app = items[i];
                if (app.name === appRequest.name && NameResolver.findByTentantId(app, appRequest) && isOwnedByCurrentUser(app))
                    return true;
            }
            return false;
        }
        else {
            // Use general overload
            return !!NameResolver.findByName(items, appRequest.name);
        }
    }
    static findByTentantId(item, appRequest) {
        if (!appRequest.organisation) {
            return true; // No tenantId in request, so it's a personal app
        }
        if (!item.tenantId) {
            return false; // No tenantId in app, so it's a personal app
        }
        // Check if the app's tenantId matches the requested organisation's tenantId
        return item.tenantId === appRequest.organisation.orgId;
    }
    static findAppByTenantId(apps, tenantId, name) {
        if (!apps.length)
            return null;
        for (let i = 0; i < apps.length; i++) {
            if (apps[i].tenantId === tenantId && apps[i].name === name) {
                return apps[i];
            }
        }
        return null;
    }
    // Definition
    static findByName(items, name) {
        if (!items.length)
            return null;
        if (items[0].collaborators) {
            // Use 'app' overload
            return NameResolver.findAppByName(items, name);
        }
        else {
            // Use general overload
            for (let i = 0; i < items.length; i++) {
                // For access keys, match both the "name" and "friendlyName" fields.
                if (items[i].name === name || name === items[i].friendlyName) {
                    return items[i];
                }
            }
            return null;
        }
    }
    static findAppByName(apps, displayName) {
        let rawName;
        let ownerEmail;
        const components = displayName.split(":");
        if (components.length === 1) {
            rawName = components[0];
        }
        else if (components.length === 2) {
            ownerEmail = components[0];
            rawName = components[1];
        }
        else {
            return null;
        }
        const candidates = apps.filter((app) => app.name === rawName);
        if (ownerEmail) {
            for (let i = 0; i < candidates.length; i++) {
                const app = candidates[i];
                if (app.collaborators[ownerEmail] && app.collaborators[ownerEmail].permission === Permissions.Owner) {
                    return app;
                }
            }
        }
        else {
            // If no owner email is specified:
            // 1. Select the only app if possible
            // 2. Otherwise select the app owned by the current account
            // 3. Otherwise the query is ambiguous and no apps will be selected
            if (candidates.length === 1) {
                return candidates[0];
            }
            for (let i = 0; i < candidates.length; i++) {
                if (isOwnedByCurrentUser(candidates[i]))
                    return candidates[i];
            }
        }
        return null;
    }
    static errorMessageOverride(code, message) {
        return (error) => {
            if (error.code === code) {
                error.message = message;
            }
            throw error;
        };
    }
    resolveAccessKey(accountId, name) {
        return this._storage
            .getAccessKeys(accountId)
            .then((accessKeys) => {
            const accessKey = NameResolver.findByName(accessKeys, name);
            if (!accessKey)
                throw storageError(ErrorCode.NotFound);
            return accessKey;
        })
            .catch(NameResolver.errorMessageOverride(ErrorCode.NotFound, `Access key "${name}" does not exist.`));
    }
    resolveApp(accountId, name, tenantId, permission) {
        return this._storage
            .getApps(accountId)
            .then((apps) => {
            //check this logic
            const app = tenantId ? NameResolver.findAppByTenantId(apps, tenantId, name) : NameResolver.findByName(apps, name);
            if (!app)
                throw storageError(ErrorCode.NotFound);
            return app;
        })
            .catch(NameResolver.errorMessageOverride(ErrorCode.NotFound, `App "${name}" does not exist.`));
    }
    resolveDeployment(accountId, appId, name) {
        return this._storage
            .getDeployments(accountId, appId)
            .then((deployments) => {
            const deployment = NameResolver.findByName(deployments, name);
            if (!deployment)
                throw storageError(ErrorCode.NotFound);
            return deployment;
        })
            .catch(NameResolver.errorMessageOverride(ErrorCode.NotFound, `Deployment "${name}" does not exist.`));
    }
}
exports.NameResolver = NameResolver;

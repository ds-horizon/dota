"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Storage = exports.MODELS = exports.defer = exports.createModelss = exports.createAppPointer = exports.createPackage = exports.createDeployment = exports.createCollaborators = exports.createTenant = exports.createApp = exports.createAccount = exports.createAccessKey = void 0;
const storage = require("./storage");
const aws_sdk_1 = require("aws-sdk");
const sequelize_1 = require("sequelize");
//import * from nanoid;
const shortid = require("shortid");
const utils = require("../utils/common");
const mysql = require("mysql2/promise");
//Creating Access Key
function createAccessKey(sequelize) {
    return sequelize.define("accessKey", {
        createdBy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        createdTime: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        expires: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        description: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        friendlyName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        id: { type: sequelize_1.DataTypes.STRING, allowNull: false, primaryKey: true },
        isSession: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
        scope: {
            type: sequelize_1.DataTypes.ENUM({
                values: ["All", "Write", "Read"]
            }),
            allowNull: true
        },
        accountId: { type: sequelize_1.DataTypes.STRING, allowNull: false, references: {
                model: sequelize.models["account"],
                key: 'id',
            }, },
    });
}
exports.createAccessKey = createAccessKey;
//Creating Account Type
function createAccount(sequelize) {
    return sequelize.define("account", {
        createdTime: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, defaultValue: () => new Date().getTime() },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        id: { type: sequelize_1.DataTypes.STRING, allowNull: false, primaryKey: true },
    });
}
exports.createAccount = createAccount;
//Creating App
function createApp(sequelize) {
    return sequelize.define("apps", {
        createdTime: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        id: { type: sequelize_1.DataTypes.STRING, allowNull: false, primaryKey: true },
        accountId: { type: sequelize_1.DataTypes.STRING, allowNull: false, references: {
                model: sequelize.models["account"],
                key: 'id',
            },
        },
        tenantId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'tenants',
                key: 'id',
            },
        },
    });
}
exports.createApp = createApp;
//Creating Tenants/Orgs
function createTenant(sequelize) {
    return sequelize.define("tenant", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        displayName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'id',
            },
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
}
exports.createTenant = createTenant;
//Create Collabarorators
function createCollaborators(sequelize) {
    return sequelize.define("collaborator", {
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        accountId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        appId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        permission: {
            type: sequelize_1.DataTypes.ENUM({
                values: ["Collaborator", "Owner"]
            }),
            allowNull: true
        },
    });
}
exports.createCollaborators = createCollaborators;
//Create Deployment
function createDeployment(sequelize) {
    return sequelize.define("deployment", {
        id: { type: sequelize_1.DataTypes.STRING, allowNull: true, primaryKey: true },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        key: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        packageId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: sequelize.models["package"],
                key: 'id',
            },
        },
        appId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            references: {
                model: sequelize.models["apps"],
                key: 'id',
            },
        },
        createdTime: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    });
}
exports.createDeployment = createDeployment;
//Create Package
function createPackage(sequelize) {
    return sequelize.define("package", {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        appVersion: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        blobUrl: { type: sequelize_1.DataTypes.STRING },
        description: { type: sequelize_1.DataTypes.STRING },
        diffPackageMap: { type: sequelize_1.DataTypes.JSON, allowNull: true },
        isDisabled: sequelize_1.DataTypes.BOOLEAN,
        isMandatory: sequelize_1.DataTypes.BOOLEAN,
        label: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        manifestBlobUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        originalDeployment: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        originalLabel: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        packageHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        releasedBy: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        releaseMethod: {
            type: sequelize_1.DataTypes.ENUM({
                values: ["Upload", "Promote", "Rollback"],
            }),
        },
        rollout: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
        size: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        uploadTime: { type: sequelize_1.DataTypes.BIGINT, allowNull: false },
        deploymentId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            references: {
                model: sequelize.models["deployment"],
                key: 'id',
            },
        },
    });
}
exports.createPackage = createPackage;
//create App Pointer
function createAppPointer(sequelize) {
    return sequelize.define("AppPointer", {
        id: {
            type: sequelize_1.DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.UUIDV4, // Generates a UUID by default
        },
        accountId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'id',
            },
        },
        appId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'apps',
                key: 'id',
            },
        },
        partitionKeyPointer: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false, // Could be useful for referencing legacy data
        },
        rowKeyPointer: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false, // Could be useful for referencing legacy data
        },
    });
}
exports.createAppPointer = createAppPointer;
function createModelss(sequelize) {
    // Create models and register them
    const Tenant = createTenant(sequelize);
    const Package = createPackage(sequelize);
    const Deployment = createDeployment(sequelize);
    const Account = createAccount(sequelize);
    const AccessKey = createAccessKey(sequelize);
    const AppPointer = createAppPointer(sequelize);
    const Collaborator = createCollaborators(sequelize);
    const App = createApp(sequelize);
    // Define associations
    // Account and App
    Account.hasMany(App, { foreignKey: 'accountId' });
    App.belongsTo(Account, { foreignKey: 'accountId' });
    // Account and Tenant
    Account.hasMany(Tenant, { foreignKey: 'createdBy' });
    Tenant.belongsTo(Account, { foreignKey: 'createdBy' });
    // Tenant and App (One Tenant can have many Apps)
    Tenant.hasMany(App, { foreignKey: 'tenantId' });
    App.belongsTo(Tenant, { foreignKey: 'tenantId' });
    // App and Deployment (One App can have many Deployments)
    App.hasMany(Deployment, { foreignKey: 'appId' });
    Deployment.belongsTo(App, { foreignKey: 'appId' });
    // Deployment and Package (One Package can be linked to many Deployments)
    Deployment.hasMany(Package, { foreignKey: 'deploymentId', as: 'packageHistory' });
    Package.belongsTo(Deployment, { foreignKey: 'deploymentId' });
    Deployment.belongsTo(Package, { foreignKey: 'packageId', as: 'packageDetails' });
    //Package.hasMany(Deployment, { foreignKey: 'packageId', as: 'deployments' });
    // Collaborator associations (Collaborators belong to both Account and App)
    Collaborator.belongsTo(Account, { foreignKey: 'accountId' });
    Collaborator.belongsTo(App, { foreignKey: 'appId' });
    // Return all models for convenience (optional)
    return {
        Tenant,
        Package,
        Deployment,
        Account,
        AccessKey,
        AppPointer,
        Collaborator,
        App,
    };
}
exports.createModelss = createModelss;
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
exports.defer = defer;
exports.MODELS = {
    COLLABORATOR: "collaborator",
    DEPLOYMENT: "deployment",
    APPS: "apps",
    PACKAGE: "package",
    ACCESSKEY: "accessKey",
    ACCOUNT: "account",
    APPPOINTER: "AppPointer",
    TENANT: "tenant"
};
const DB_NAME = "codepushdb";
const DB_USER = "codepush";
const DB_PASS = "root";
const DB_HOST = "localhost";
class S3Storage {
    s3;
    bucketName = process.env.S3_BUCKETNAME || "codepush-local-bucket";
    sequelize;
    setupPromise;
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            endpoint: process.env.S3_ENDPOINT,
            s3ForcePathStyle: true,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            region: process.env.S3_REGION
        });
        shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-");
        // Ensure the database exists, then initialize Sequelize
        this.setupPromise = this.createDatabaseIfNotExists().then(() => {
            this.sequelize = new sequelize_1.Sequelize({
                database: process.env.DB_NAME || DB_NAME,
                dialect: 'mysql',
                replication: {
                    write: {
                        host: process.env.DB_HOST || DB_HOST,
                        username: process.env.DB_USER || DB_USER,
                        password: process.env.DB_PASS || DB_PASS
                    },
                    read: [
                        {
                            host: process.env.DB_HOST_READER,
                            username: process.env.DB_USER || DB_USER,
                            password: process.env.DB_PASS || DB_PASS
                        }
                    ]
                },
                pool: {
                    max: 5,
                    min: 1,
                    acquire: 10000,
                    idle: 10000,
                    evict: 15000,
                    maxUses: 100000
                }
            });
            return this.setup();
        });
    }
    async createDatabaseIfNotExists() {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS || DB_PASS,
            });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
            console.log(`Database "${process.env.DB_NAME}" ensured.`);
            await connection.end();
        }
        catch (error) {
            console.error("Error creating database:", error);
            throw error;
        }
    }
    setup() {
        let headBucketParams = {
            Bucket: this.bucketName,
        };
        let createBucketParams = {
            Bucket: this.bucketName,
        };
        return this.s3.headBucket(headBucketParams).promise()
            .catch((err) => {
            if (err.code === 'NotFound' || err.code === 'NoSuchBucket') {
                console.log(`Bucket ${this.bucketName} does not exist, creating it...`);
                return this.s3.createBucket(createBucketParams).promise();
            }
            else if (err.code === 'Forbidden') {
                console.error('Forbidden: Check your credentials and S3 endpoint');
                throw err;
            }
            else {
                throw err;
            }
        })
            .then(() => {
            return this.sequelize.authenticate();
        })
            .then(() => {
            const models = createModelss(this.sequelize);
            console.log("Models registered");
            // return this.sequelize.sync();
        })
            .then(() => {
            console.log("Sequelize models synced");
            console.log(this.sequelize.models);
        })
            .catch((error) => {
            console.error('Error during setup:', error);
            throw error;
        });
    }
    reinitialize() {
        console.log("Re-initializing AWS storage");
        return this.setup();
    }
    checkHealth() {
        return new Promise((resolve, reject) => {
            this.setupPromise
                .then(() => {
                return Promise.all([this.sequelize.authenticate()]);
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
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.ACCOUNT].findOrCreate({ where: { id: account.id }, defaults: {
                    ...account
                } }); // Successfully fails if duplicate email
        })
            .then(() => {
            return account.id;
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getAccount(accountId) {
        console.log("Fetching account for accountId:", accountId); // Debug log
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.ACCOUNT].findByPk(accountId);
        })
            .then((account) => {
            console.log("Fetched account:", account.dataValues); // Debug log
            return account.dataValues;
        })
            .catch((error) => {
            console.error("Error fetching account:", error.message);
            throw S3Storage.storageErrorHandler(error);
        });
    }
    getAccountByEmail(email) {
        return this.setupPromise
            .then(async () => {
            const account = await this.sequelize.models[exports.MODELS.ACCOUNT].findOne({ where: { email: email } });
            //Fix this error code
            return account !== null ? Promise.resolve(account.dataValues) : Promise.reject({ code: 1 });
        });
    }
    updateAccount(email, updateProperties) {
        if (!email)
            throw new Error("No account email");
        return this.setupPromise
            .then(() => {
            this.sequelize.models[exports.MODELS.ACCOUNT].update({
                ...updateProperties
            }, {
                where: { "email": email },
            });
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getAccountIdFromAccessKey(accessKey) {
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findOne({
                where: { "name": accessKey }
            });
        })
            .then((accessKey) => {
            if (new Date().getTime() >= accessKey.dataValues["expires"]) {
                throw storage.storageError(storage.ErrorCode.Expired, "The access key has expired.");
            }
            return accessKey.dataValues["accountId"];
        })
            .catch(S3Storage.storageErrorHandler);
    }
    addApp(accountId, app) {
        app = storage.clone(app); // Clone the app data to avoid mutating the original
        app.id = shortid.generate();
        return this.setupPromise
            .then(() => this.getAccount(accountId)) // Fetch account details to check permissions
            .then(async (account) => {
            // Set initial tenantId and tenantName from app data
            let tenantId = app.tenantId;
            let tenantName = app.tenantName;
            // Check if a tenantId is provided, and if so, verify or create tenant
            if (tenantId) {
                // Attempt to find the tenant by tenantId and tenantName
                const tenant = await this.sequelize.models[exports.MODELS.TENANT].findOne({
                    where: { id: tenantId },
                });
                // If tenant is not found or tenantName doesn't match, create a new tenant
                if (!tenant) {
                    console.log(`Specified tenant (ID: ${tenantId}, Name: ${tenantName}) does not exist. Creating a new tenant.`);
                    const idTogenerate = shortid.generate();
                    // Create a new tenant with the specified tenantName, owned by the accountId
                    const newTenant = await this.sequelize.models[exports.MODELS.TENANT].create({
                        id: idTogenerate,
                        displayName: tenantName,
                        createdBy: accountId,
                    });
                    tenantId = idTogenerate;
                }
                else {
                    // Verify if the user has admin permissions for the existing tenant
                    // const isAdmin = await this.sequelize.models[MODELS.COLLABORATOR].findOne({
                    //   where: { accountId, tenantId, permission: storage.Permissions.Owner },
                    // });
                    const isAdmin = tenant.dataValues.createdBy === accountId;
                    if (!isAdmin) {
                        throw new Error("User does not have admin permissions for the specified tenant.");
                    }
                }
            }
            else if (tenantName) {
                //MARK Fix: Check if tenantName does not exist
                const tenant = await this.sequelize.models[exports.MODELS.TENANT].findOne({
                    where: { displayName: tenantName },
                });
                if (tenant) {
                    throw new Error("An organization or user of this name already exists. Please select a different name.");
                }
                else {
                    // If no tenantId is provided, set tenantId to NULL (app is standalone/personal)
                    const idTogenerate = shortid.generate();
                    // Create a new tenant with the specified tenantName, owned by the accountId
                    const newTenant = await this.sequelize.models[exports.MODELS.TENANT].create({
                        id: idTogenerate,
                        displayName: tenantName,
                        createdBy: accountId,
                    });
                    tenantId = idTogenerate;
                }
            }
            // Set the tenantId on the app object
            app.tenantId = tenantId;
            // Add the App with accountId and tenantId
            const addedApp = await this.sequelize.models[exports.MODELS.APPS].create({
                ...app,
                accountId,
            });
            // Add a Collaborator entry for the app owner
            const collabMap = {
                email: account.email,
                accountId,
                permission: storage.Permissions.Owner,
                appId: app.id,
            };
            await this.sequelize.models[exports.MODELS.COLLABORATOR].findOrCreate({
                where: { appId: app.id, email: account.email },
                defaults: collabMap,
            });
            return addedApp;
        })
            .then(() => app) // Return the app object
            .catch((error) => {
            console.error("Error adding app:", error.message);
            throw S3Storage.storageErrorHandler(error);
        });
    }
    getApps(accountId) {
        return this.setupPromise
            .then(() => {
            // Fetch all tenants where the account is a collaborator
            return this.sequelize.models[exports.MODELS.COLLABORATOR].findAll({
                where: { accountId: accountId },
            });
        }).then((collaborators) => {
            const appIds = collaborators.map((collaborator) => {
                const collaboratorModel = collaborator.dataValues;
                return collaboratorModel.appId;
            });
            return this.sequelize.models[exports.MODELS.APPS].findAll({
                where: {
                    id: appIds, // Match app IDs
                }
            });
        })
            .then(async (flatAppsModel) => {
            const flatApps = flatAppsModel.map((val) => val.dataValues);
            const apps = [];
            for (let i = 0; i < flatApps.length; i++) {
                const updatedApp = await this.getCollabrators(flatApps[i], accountId);
                apps.push(updatedApp);
            }
            return apps;
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getTenants(accountId) {
        //first get all tenants
        //get apps for each tenant
        //check if user is owner or collaborator of one of that app
        //if yes then serve that tenant
        return this.setupPromise
            .then(() => {
            // Fetch all tenants where the account is a collaborator
            return this.sequelize.models[exports.MODELS.COLLABORATOR].findAll({
                where: { accountId: accountId },
            });
        }).then((collaborators) => {
            const appIds = collaborators.map((collaborator) => {
                const collaboratorModel = collaborator.dataValues;
                return collaboratorModel.appId;
            });
            return this.sequelize.models[exports.MODELS.APPS].findAll({
                where: {
                    id: appIds, // Match app IDs
                }
            });
        }).then((apps) => {
            const tenantIds = apps.map((app) => app.dataValues.tenantId);
            return this.sequelize.models[exports.MODELS.TENANT].findAll({
                where: {
                    id: tenantIds, // Match tenant IDs
                }
            });
        })
            .then((tenantsModel) => {
            // Format tenants into the desired response structure
            const tenants = tenantsModel.map((tenantModel) => {
                const tenant = tenantModel.dataValues;
                const permission = tenant.createdBy === accountId ? "Owner" : "Collaborator";
                //permission could be modified if user account does not belong to Collabrator to any other app of that tenant.
                return {
                    id: tenant.id,
                    displayName: tenant.displayName,
                    role: permission,
                };
            });
            return tenants;
        })
            .catch(S3Storage.storageErrorHandler);
    }
    removeTenant(accountId, tenantId) {
        return this.setupPromise
            .then(async () => {
            // Remove all apps under the tenant
            //Remove all collaborators from that apps
            //check permission whether user is owner or not
            const tenant = await this.sequelize.models[exports.MODELS.TENANT].findOne({
                where: { id: tenantId },
            });
            if (!tenant) {
                throw storage.storageError(storage.ErrorCode.NotFound, "Specified Organisation does not exist.");
            }
            if (tenant.dataValues.createdBy !== accountId) {
                throw storage.storageError(storage.ErrorCode.Invalid, "User does not have admin permissions for the specified tenant.");
            }
            const apps = await this.sequelize.models[exports.MODELS.APPS].findAll({
                where: { tenantId },
            });
            // Iterate over each app and take appropriate action
            for (const app of apps) {
                const appOwnerId = app.dataValues.accountId;
                if (appOwnerId === accountId) {
                    // If the app is owned by the user, remove it
                    await this.removeApp(accountId, app.dataValues.id);
                }
                else {
                    // If the app is not owned by the user, set tenantId to null
                    await this.sequelize.models[exports.MODELS.APPS].update({ tenantId: null }, { where: { id: app.dataValues.id } });
                }
            }
        })
            .then(() => {
            // Remove the tenant entry
            return this.sequelize.models[exports.MODELS.TENANT].destroy({
                where: { id: tenantId, createdBy: accountId },
            });
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getApp(accountId, appId, keepCollaboratorIds = false) {
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.APPS].findByPk(appId, {
                include: [{ model: this.sequelize.models[exports.MODELS.TENANT], as: 'tenant' }], // Include tenant details if available
            });
        })
            .then((flatAppModel) => {
            return this.getCollabrators(flatAppModel.dataValues, accountId);
        })
            .then((app) => {
            return app;
        })
            .catch(S3Storage.storageErrorHandler);
    }
    removeApp(accountId, appId) {
        return this.setupPromise
            .then(() => {
            // Remove all collaborator entries for this app
            return this.sequelize.models[exports.MODELS.COLLABORATOR].destroy({
                where: { appId, accountId },
            });
        })
            .then(() => {
            // Remove the app entry
            return this.sequelize.models[exports.MODELS.APPS].destroy({
                where: { id: appId, accountId },
            });
        })
            .then(() => {
            // Remove the app entry
            //MARK: Fix this
            this.removeAppPointer(accountId, appId);
        })
            .catch(S3Storage.storageErrorHandler);
    }
    updateApp(accountId, app) {
        const appId = app.id;
        if (!appId)
            throw new Error("No app id");
        return this.setupPromise
            .then(() => {
            return this.updateAppWithPermission(accountId, app, true);
        })
            .catch(S3Storage.storageErrorHandler);
    }
    //P1
    //MARK: TODO
    transferApp(accountId, appId, email) {
        let app;
        let targetCollaboratorAccountId;
        let requestingCollaboratorEmail;
        let isTargetAlreadyCollaborator;
        return this.setupPromise
            .then(() => {
            const getAppPromise = this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
            const accountPromise = this.getAccountByEmail(email);
            return Promise.all([getAppPromise, accountPromise]);
        })
            .then(([appPromiseResult, accountPromiseResult]) => {
            targetCollaboratorAccountId = accountPromiseResult.id;
            email = accountPromiseResult.email; // Use the original email stored on the account to ensure casing is consistent
            app = appPromiseResult;
            requestingCollaboratorEmail = S3Storage.getEmailForAccountId(app.collaborators, accountId);
            if (requestingCollaboratorEmail === email) {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, "The given account already owns the app.");
            }
            return this.getApps(targetCollaboratorAccountId);
        })
            .then((appsForCollaborator) => {
            if (storage.NameResolver.isDuplicate(appsForCollaborator, app.name)) {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, 'Cannot transfer ownership. An app with name "' + app.name + '" already exists for the given collaborator.');
            }
            isTargetAlreadyCollaborator = S3Storage.isCollaborator(app.collaborators, email);
            // Update the current owner to be a collaborator
            S3Storage.setCollaboratorPermission(app.collaborators, requestingCollaboratorEmail, storage.Permissions.Collaborator);
            // set target collaborator as an owner.
            if (isTargetAlreadyCollaborator) {
                S3Storage.setCollaboratorPermission(app.collaborators, email, storage.Permissions.Owner);
            }
            else {
                const targetOwnerProperties = {
                    accountId: targetCollaboratorAccountId,
                    permission: storage.Permissions.Owner,
                };
                S3Storage.addToCollaborators(app.collaborators, email, targetOwnerProperties);
            }
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true);
        })
            .then(() => {
            if (!isTargetAlreadyCollaborator) {
                // Added a new collaborator as owner to the app, create a corresponding entry for app in target collaborator's account.
                return this.addAppPointer(targetCollaboratorAccountId, app.id);
            }
        })
            .catch(S3Storage.storageErrorHandler);
    }
    addAppPointer(accountId, appId) {
        return this.setupPromise
            .then(() => {
            // Directly create the pointer in the DB using foreign keys (instead of partition/row keys)
            return this.sequelize.models[exports.MODELS.APPPOINTER].create({
                accountId,
                appId,
                partitionKeyPointer: `accountId ${accountId}`,
                rowKeyPointer: `appId ${appId}`,
            });
        })
            .then(() => {
            console.log('App pointer added successfully');
            return Promise.resolve();
        })
            .catch(S3Storage.storageErrorHandler);
    }
    //P0
    addCollaborator(accountId, appId, email) {
        return this.setupPromise
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
            .catch(S3Storage.storageErrorHandler);
    }
    updateCollaborators(accountId, appId, email, role) {
        return this.setupPromise
            .then(() => {
            const getAppPromise = this.getApp(accountId, appId, /*keepCollaboratorIds*/ true);
            const requestCollaboratorAccountPromise = this.getAccountByEmail(email);
            return Promise.all([getAppPromise, requestCollaboratorAccountPromise]);
        })
            .then(([app, accountToModify]) => {
            // Use the original email stored on the account to ensure casing is consistent
            email = accountToModify.email;
            let permission = role === "Owner" ? storage.Permissions.Owner : storage.Permissions.Collaborator;
            return this.updateCollaboratorWithPermissions(accountId, app, email, {
                accountId: accountToModify.id,
                permission: permission,
            });
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getCollaborators(accountId, appId) {
        return this.setupPromise
            .then(() => {
            return this.getApp(accountId, appId, /*keepCollaboratorIds*/ false);
        })
            .then((app) => {
            return Promise.resolve(app.collaborators);
        })
            .catch(S3Storage.storageErrorHandler);
    }
    removeCollaborator(accountId, appId, email) {
        return this.setupPromise
            .then(() => {
            // Get the App and Collaborators from the DB
            return this.getApp(accountId, appId, true);
        })
            .then((app) => {
            const removedCollabProperties = app.collaborators[email];
            if (!removedCollabProperties) {
                throw storage.storageError(storage.ErrorCode.NotFound, "The given email is not a collaborator for this app.");
            }
            // Cannot remove the owner
            if (removedCollabProperties.permission === storage.Permissions.Owner) {
                throw storage.storageError(storage.ErrorCode.AlreadyExists, "Cannot remove the owner of the app from collaborator list.");
            }
            // Remove the collaborator
            delete app.collaborators[email];
            // Update the App in the DB
            return this.updateAppWithPermission(accountId, app, true).then(() => {
                return this.removeAppPointer(removedCollabProperties.accountId, app.id);
            });
        })
            .catch(S3Storage.storageErrorHandler);
    }
    removeAppPointer(accountId, appId) {
        return this.setupPromise
            .then(() => {
            // Use Sequelize to destroy (delete) the record
            return this.sequelize.models[exports.MODELS.APPPOINTER].destroy({
                where: {
                    accountId: accountId,
                    appId: appId,
                },
            });
        })
            .then((deletedCount) => {
            if (deletedCount === 0) {
                console.log('AppPointer not found');
            }
            console.log('AppPointer successfully removed');
        })
            .catch((error) => {
            console.error('Error removing AppPointer:', error);
            throw error;
        });
    }
    //Utility Collaboratos methods
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
        if (collaboratorsMap && email && !storage.isPrototypePollutionKey(email) && collaboratorsMap[email]) {
            collaboratorsMap[email].permission = permission;
        }
    }
    static addToCollaborators(collaboratorsMap, email, collabProps) {
        if (collaboratorsMap && email && !storage.isPrototypePollutionKey(email) && !collaboratorsMap[email]) {
            collaboratorsMap[email] = collabProps;
        }
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
    updateCollaboratorWithPermissions(accountId, app, email, collabProperties) {
        if (app && app.collaborators && app.collaborators[email]) {
            app.collaborators[email] = collabProperties;
            return this.updateAppWithPermission(accountId, app, /*updateCollaborator*/ true).then(() => {
                return this.addAppPointer(collabProperties.accountId, app.id);
            });
        }
        else {
            throw storage.storageError(storage.ErrorCode.AlreadyExists, "The given account is already a collaborator for this app.");
        }
    }
    //Deployment Methods
    addDeployment(accountId, appId, deployment) {
        let deploymentId;
        return this.setupPromise
            .then(() => {
            // Generate deployment ID
            deployment.id = shortid.generate();
            deploymentId = deployment.id;
            // Insert the deployment in the DB
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].create({ ...deployment, appId, createdTime: Date.now() });
        })
            .then(() => {
            // Return deployment ID
            return deploymentId;
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getDeploymentInfo(deploymentKey) {
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].findOne({ where: { key: deploymentKey } });
        })
            .then((deployment) => {
            if (!deployment) {
                throw storage.storageError(storage.ErrorCode.NotFound, "Deployment not found");
            }
            return { appId: deployment.appId, deploymentId: deployment.id };
        })
            .catch(S3Storage.storageErrorHandler);
    }
    getDeployments(accountId, appId) {
        return this.setupPromise
            .then(() => {
            // Retrieve deployments for the given appId, including the associated Package
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].findAll({
                where: { appId: appId },
            });
        })
            .then((flatDeployments) => {
            // Use Promise.all to wait for all unflattenDeployment promises to resolve
            return Promise.all(flatDeployments.map((flatDeployment) => this.attachPackageToDeployment(accountId, flatDeployment)));
        })
            .catch((error) => {
            console.error("Error retrieving deployments:", error);
            throw error;
        });
    }
    removeDeployment(accountId, appId, deploymentId) {
        //MARK:TODO TEST THIS
        return this.setupPromise
            .then(() => {
            // Delete the deployment from the database using Sequelize
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].destroy({
                where: { id: deploymentId, appId: appId },
            });
        })
            .then(() => {
            // Delete history from S3
            return this.deleteHistoryBlob(deploymentId);
        })
            .catch((error) => {
            console.error("Error deleting deployment:", error);
            throw error;
        });
    }
    updateDeployment(accountId, appId, deployment) {
        const deploymentId = deployment.id;
        if (!deploymentId)
            throw new Error("No deployment id");
        return this.setupPromise
            .then(() => {
            // Update deployment details in the database
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].update(deployment, {
                where: { id: deploymentId, appId: appId },
            });
        })
            .then(() => { })
            .catch((error) => {
            console.error("Error updating deployment:", error);
            throw error;
        });
    }
    /*
                // Remove the rollout value for the last package.
               const lastPackage: storage.Package = packageHistory.length ? packageHistory[packageHistory.length - 1] : null;
               if (lastPackage) {
                 lastPackage.rollout = null;
               }
    */
    commitPackage(accountId, appId, deploymentId, appPackage) {
        if (!deploymentId)
            throw new Error("No deployment id");
        if (!appPackage)
            throw new Error("No package specified");
        let packageHistory;
        return this.setupPromise
            .then(() => {
            // Fetch the package history from S3
            return this.getPackageHistory(accountId, appId, deploymentId);
        })
            .then((history) => {
            packageHistory = history;
            appPackage.label = this.getNextLabel(packageHistory);
            return this.getAccount(accountId);
        })
            .then(async (account) => {
            appPackage.releasedBy = account.email;
            // Remove the rollout value for the last package.
            const lastPackage = packageHistory.length ? packageHistory[packageHistory.length - 1] : null;
            //MARK: TODO TEST THIS
            // if (lastPackage) {
            //   lastPackage.rollout = null;
            // }
            packageHistory.push(appPackage);
            if (packageHistory.length > 100) { // Define your max history length
                packageHistory.splice(0, packageHistory.length - 100);
            }
            const savedPackage = await this.sequelize.models[exports.MODELS.PACKAGE].create({ ...appPackage, deploymentId });
            // Update deployment with the new package information
            await this.sequelize.models[exports.MODELS.DEPLOYMENT].update({ packageId: savedPackage.dataValues.id }, { where: { id: deploymentId, appId } });
            return savedPackage.dataValues;
        })
            .catch((error) => {
            console.error("Error committing package:", error);
            throw error;
        });
    }
    clearPackageHistory(accountId, appId, deploymentId) {
        return this.setupPromise
            .then(() => {
            // Remove all packages linked to the deployment
            return this.sequelize.models[exports.MODELS.PACKAGE].destroy({
                where: { deploymentId },
            });
        })
            .then(() => {
            // Reset the currentPackageId for the deployment to clear the history
            return this.sequelize.models[exports.MODELS.DEPLOYMENT].update({ currentPackageId: null }, { where: { id: deploymentId, appId } });
        })
            .then(() => { })
            .catch((error) => {
            console.error("Error clearing package history:", error);
            throw error;
        });
    }
    getPackageHistory(accountId, appId, deploymentId) {
        return this.setupPromise
            .then(() => {
            // Fetch all packages associated with the deploymentId, ordered by uploadTime
            return this.sequelize.models[exports.MODELS.PACKAGE].findAll({
                where: { deploymentId: deploymentId },
                order: [['uploadTime', 'ASC']], // Sort by upload time to maintain historical order
            });
        })
            .then((packageRecords) => {
            // Map each package record to the storage.Package format
            return packageRecords.map((pkgRecord) => this.formatPackage(pkgRecord.dataValues));
        })
            .catch((error) => {
            console.error("Error retrieving package history:", error);
            throw error;
        });
    }
    updatePackageHistory(accountId, appId, deploymentId, history) {
        if (!history || !history.length) {
            throw new Error("Cannot clear package history from an update operation");
        }
        return this.setupPromise
            .then(async () => {
            for (const appPackage of history) {
                // Find the existing package in the table
                const existingPackage = await this.sequelize.models[exports.MODELS.PACKAGE].findOne({
                    where: { deploymentId: deploymentId, packageHash: appPackage.packageHash },
                });
                if (existingPackage) {
                    const existingData = existingPackage.dataValues;
                    const isChanged = Object.keys(appPackage).some((key) => {
                        return appPackage[key] !== existingData[key];
                    });
                    // Update the package if it has been changed
                    if (isChanged) {
                        await this.sequelize.models[exports.MODELS.PACKAGE].update(appPackage, {
                            where: { id: existingData.id },
                        });
                    }
                }
                else {
                    // If the package does not exist, insert it
                    await this.sequelize.models[exports.MODELS.PACKAGE].create({
                        ...appPackage,
                        deploymentId: deploymentId,
                    });
                }
            }
        })
            .catch((error) => {
            console.error("Error updating package history:", error);
            throw error;
        });
    }
    //Utility Package Methods
    //blobs
    addBlob(blobId, stream, streamLength) {
        return this.setupPromise
            .then(() => {
            // Generate a unique key if blobId is not provided
            if (!blobId) {
                blobId = `deployments/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.zip`;
                console.log("Generated Blob ID:", blobId);
            }
            // Convert the stream to a buffer
            return utils.streamToBufferS3(stream);
        })
            .then((buffer) => {
            // Upload the buffer to S3
            return this.s3
                .putObject({
                Bucket: this.bucketName,
                Key: blobId,
                Body: buffer,
                ContentType: 'application/zip', // Assume all deployments are zipped
            })
                .promise();
        })
            .then(() => {
            console.log('blobId here ::', blobId);
            //generate CF Distribution URL using environment variable signed Url
            return blobId;
        }) // Return the Blob ID for further use
            .catch((error) => {
            console.error("Error adding blob:", error);
            throw error;
        });
    }
    getSignedUrlFromCF(blobId) {
        const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${blobId}`;
        // Generate a signed URL
        // const privateKey = fs.readFileSync(process.env.CLOUDFRONT_PRIVATE_KEY_PATH, 'utf8')
        // const signedUrl = getSignedUrl(cloudFrontUrl, {
        //   keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID, // Replace with your CloudFront Key Pair ID
        //   privateKeyString: privateKey, // Replace with the private key content or path
        //   expireTime: Date.now() + 60 * 60 * 12000, // 24-hour expiration
        // });
        // console.log('signedUrl here ::', signedUrl);
        return cloudFrontUrl;
    }
    getBlobUrl(blobId) {
        return this.setupPromise
            .then(() => {
            if (process.env.NODE_ENV === "development") {
                // Get the signed URL from S3
                return this.s3.getSignedUrlPromise('getObject', {
                    Bucket: this.bucketName,
                    Key: blobId,
                    Expires: 60 * 60 * 24000, // URL valid for 1 hour
                });
            }
            else {
                return this.getSignedUrlFromCF(blobId);
            }
        })
            .catch((error) => {
            console.error("Error getting blob URL:", error);
            throw error;
        });
    }
    removeBlob(blobId) {
        return this.setupPromise
            .then(() => {
            // Delete the blob from S3
            return this.s3.deleteObject({
                Bucket: this.bucketName,
                Key: blobId,
            }).promise();
        })
            .then(() => { })
            .catch((error) => {
            console.error("Error removing blob:", error);
            throw error;
        });
    }
    //MARK: TODO Test this
    getPackageHistoryFromDeploymentKey(deploymentKey) {
        return this.setupPromise
            .then(async () => {
            let deployment = await this.sequelize.models[exports.MODELS.DEPLOYMENT].findOne({ where: { key: deploymentKey } });
            if (!deployment?.dataValues) {
                console.log(`Deployment not found for key: ${deploymentKey}`);
                return [];
            }
            return deployment.dataValues;
        })
            .then((deployment) => {
            // Fetch all packages associated with the deploymentId, ordered by uploadTime
            if (!deployment?.id) {
                console.log("Skipping package lookup due to missing deployment data.");
                return [];
            }
            return this.sequelize.models[exports.MODELS.PACKAGE].findAll({
                where: { deploymentId: deployment.id },
                order: [['uploadTime', 'ASC']], // Sort by upload time to maintain historical order
            });
        })
            .then((packageRecords) => {
            if (!Array.isArray(packageRecords) || packageRecords.length === 0) {
                console.log("No packages found for the given deployment.");
                return [];
            }
            // Map each package record to the storage.Package format
            return packageRecords.map((pkgRecord) => this.formatPackage(pkgRecord.dataValues));
        })
            .catch((error) => {
            console.error("Error retrieving package history:", error);
            throw error;
        });
    }
    getPackageHistoryFromBlob(deploymentId) {
        const deferred = defer();
        // Use AWS SDK to download the blob from S3
        this.s3
            .getObject({ Bucket: this.bucketName, Key: `${deploymentId}/history.json` })
            .promise()
            .then((data) => {
            const packageHistory = JSON.parse(data.Body.toString());
            deferred.resolve(packageHistory);
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    //blob utility methods
    deleteHistoryBlob(blobId) {
        const deferred = defer();
        this.s3
            .deleteObject({
            Bucket: this.bucketName,
            Key: blobId // The blob (file) ID to be deleted
        })
            .promise()
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    uploadToHistoryBlob(deploymentId, content) {
        const deferred = defer();
        this.s3
            .putObject({
            Bucket: this.bucketName,
            Key: `${deploymentId}/history.json`,
            Body: content,
            ContentType: "application/json",
        })
            .promise()
            .then(() => {
            deferred.resolve();
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    //Access Key Conformation
    addAccessKey(accountId, accessKey) {
        accessKey.id = shortid.generate();
        return this.setupPromise
            .then(() => {
            // Insert the access key into the database
            return this.sequelize.models[exports.MODELS.ACCESSKEY].create({ ...accessKey, accountId });
        })
            .then(() => {
            return accessKey.id;
        });
    }
    getUserFromAccessKey(accessKey) {
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findOne({ where: { friendlyName: accessKey } });
        }).then(async (accessKey) => {
            if (!accessKey) {
                throw new Error("Access key not found");
            }
            return this.getAccount(accessKey.accountId);
        }).catch((error) => {
            console.error("Error retrieving account:", error);
            throw error;
        });
    }
    getUserFromAccessToken(accessToken) {
        return this.setupPromise
            .then(() => {
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findOne({ where: { name: accessToken } });
        }).then(async (accessKey) => {
            if (!accessKey) {
                throw new Error("Access key not found");
            }
            return this.getAccount(accessKey.accountId);
        }).catch((error) => {
            console.error("Error retrieving account:", error);
            throw error;
        });
    }
    getAccessKey(accountId, accessKeyId) {
        return this.setupPromise
            .then(() => {
            // Find the access key in the database using Sequelize
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findOne({
                where: {
                    accountId: accountId,
                    id: accessKeyId,
                },
            });
        })
            .then((accessKey) => {
            if (!accessKey) {
                throw new Error("Access key not found");
            }
            return accessKey.dataValues; // Return the access key data
        })
            .catch((error) => {
            console.error("Error retrieving access key:", error);
            throw error;
        });
    }
    removeAccessKey(accountId, accessKeyId) {
        return this.setupPromise
            .then(() => {
            // First, retrieve the access key
            return this.getAccessKey(accountId, accessKeyId);
        })
            .then((accessKey) => {
            if (!accessKey) {
                throw new Error("Access key not found");
            }
            // Remove the access key from the database
            return this.sequelize.models[exports.MODELS.ACCESSKEY].destroy({
                where: {
                    accountId: accountId,
                    id: accessKeyId,
                },
            });
        })
            .then(() => {
            console.log("Access key removed successfully");
        })
            .catch((error) => {
            console.error("Error removing access key:", error);
            throw error;
        });
    }
    updateAccessKey(accountId, accessKey) {
        if (!accessKey) {
            throw new Error("No access key provided");
        }
        if (!accessKey.id) {
            throw new Error("No access key ID provided");
        }
        return this.setupPromise
            .then(() => {
            // Update the access key in the database
            return this.sequelize.models[exports.MODELS.ACCESSKEY].update(accessKey, {
                where: {
                    accountId: accountId,
                    id: accessKey.id,
                },
            });
        })
            .then(() => {
            console.log("Access key updated successfully");
        })
            .catch((error) => {
            console.error("Error updating access key:", error);
            throw error;
        });
    }
    getAccessKeys(accountId) {
        return this.setupPromise
            .then(() => {
            // Retrieve all access keys for the account
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findAll({ where: { accountId } });
        })
            .then((accessKeys) => {
            return accessKeys.map((accessKey) => accessKey.dataValues);
        });
    }
    getDeployment(accountId, appId, deploymentId) {
        return this.setupPromise
            .then(async () => {
            // Fetch the deployment by appId and deploymentId using Sequelize
            return this.retrieveByAppHierarchy(appId, deploymentId);
        })
            .then(async (flatDeployment) => {
            // Convert the retrieved Sequelize object to the desired format
            return this.attachPackageToDeployment(accountId, flatDeployment);
        })
            .catch((error) => {
            // Handle any Sequelize errors here
            console.error("Error fetching deployment:", error);
            throw error;
        });
    }
    unflattenDeployment(flatDeployment) {
        if (!flatDeployment)
            throw new Error("Deployment not found");
        // Parse the package field if it's stored as a JSON string in the DB
        flatDeployment.package = flatDeployment.package ? JSON.parse(flatDeployment.package) : null;
        // Return the unflattened deployment
        return flatDeployment;
    }
    async attachPackageToDeployment(accounId, flatDeployment) {
        if (!flatDeployment)
            throw new Error("Deployment not found");
        // Retrieve the package details from the Package table using packageId
        let packageData = null;
        let packageHistory = [];
        if (flatDeployment.packageId) {
            const packageRecord = await this.sequelize.models[exports.MODELS.PACKAGE].findOne({
                where: { id: flatDeployment.packageId },
            });
            if (packageRecord) {
                packageData = this.formatPackage(packageRecord.dataValues); // Format to match storage.Package interface
            }
        }
        packageHistory = await this.getPackageHistory(accounId, flatDeployment.appId, flatDeployment.id);
        // Construct and return the full deployment object
        return {
            id: flatDeployment.id,
            name: flatDeployment.name,
            key: flatDeployment.key,
            package: packageData,
            packageHistory: packageHistory,
        };
    }
    // Helper function to format package data to storage.Package
    formatPackage(pkgData) {
        if (!pkgData)
            return null;
        return {
            appVersion: pkgData.appVersion,
            blobUrl: pkgData.blobUrl,
            description: pkgData.description,
            diffPackageMap: pkgData.diffPackageMap ? JSON.parse(pkgData.diffPackageMap) : undefined,
            isDisabled: pkgData.isDisabled,
            isMandatory: pkgData.isMandatory,
            label: pkgData.label,
            manifestBlobUrl: pkgData.manifestBlobUrl,
            originalDeployment: pkgData.originalDeployment,
            originalLabel: pkgData.originalLabel,
            packageHash: pkgData.packageHash,
            releasedBy: pkgData.releasedBy,
            releaseMethod: pkgData.releaseMethod,
            rollout: pkgData.rollout,
            size: pkgData.size,
            uploadTime: pkgData.uploadTime,
        };
    }
    retrieveByAppHierarchy(appId, deploymentId) {
        return Promise.resolve(this.sequelize.models[exports.MODELS.DEPLOYMENT].findOne({
            where: {
                appId: appId,
                id: deploymentId, // Assuming 'id' is the deploymentId
            }
        }));
    }
    // No-op for safety, so that we don't drop the wrong db, pending a cleaner solution for removing test data.
    dropAll() {
        return Promise.resolve(null);
    }
    async getCollabrators(app, accountId) {
        const collabModel = await this.sequelize.models[exports.MODELS.COLLABORATOR].findAll({ where: { appId: app.id } });
        const collabMap = {};
        collabModel.map((collab) => {
            collabMap[collab.dataValues["email"]] = {
                ...collab.dataValues,
                "isCurrentAccount": false
            };
        });
        const currentUserEmail = S3Storage.getEmailForAccountId(collabMap, accountId);
        if (currentUserEmail && collabMap[currentUserEmail]) {
            collabMap[currentUserEmail].isCurrentAccount = true;
        }
        app["collaborators"] = collabMap;
        return app;
    }
    updateAppWithPermission(accountId, app, updateCollaborator = false) {
        const appId = app.id;
        if (!appId)
            throw new Error("No app id");
        const flatApp = this.flattenAppForSequelize(app, updateCollaborator);
        // Start a transaction since we may be updating multiple tables (app + collaborators)
        return this.setupPromise
            .then(() => {
            return this.sequelize.transaction((t) => {
                // Update the App in the database
                return this.sequelize.models[exports.MODELS.APPS].update(flatApp, {
                    where: { id: appId },
                    transaction: t,
                }).then(() => {
                    if (updateCollaborator && app.collaborators) {
                        // Remove 'isCurrentAccount' flag before updating collaborators
                        this.deleteIsCurrentAccountProperty(app.collaborators);
                        // First, remove existing collaborators for this app
                        return this.sequelize.models[exports.MODELS.COLLABORATOR].destroy({
                            where: { appId: appId },
                            transaction: t,
                        }).then(() => {
                            // Then, add updated collaborators
                            const collaborators = Object.keys(app.collaborators).map((email) => {
                                const collaborator = app.collaborators[email];
                                return {
                                    email,
                                    accountId: collaborator.accountId,
                                    appId: appId,
                                    permission: collaborator.permission,
                                };
                            });
                            // Add updated collaborators
                            return this.sequelize.models[exports.MODELS.COLLABORATOR].bulkCreate(collaborators, { transaction: t }).then(() => {
                                // Explicitly return void to satisfy the function's return type
                                return;
                            });
                        });
                    }
                    else {
                        // No collaborator update, just resolve the promise
                        return;
                    }
                });
            });
        });
    }
    flattenAppForSequelize(app, updateCollaborator = false) {
        if (!app) {
            return app;
        }
        const flatApp = {};
        for (const property in app) {
            if (property === "collaborators" && updateCollaborator) {
                this.deleteIsCurrentAccountProperty(app.collaborators); // Remove unnecessary properties from collaborators
            }
            else if (property !== "collaborators") {
                flatApp[property] = app[property]; // Copy all other properties
            }
        }
        return flatApp;
    }
    getNextLabel(packageHistory) {
        if (packageHistory.length === 0) {
            return "v1";
        }
        const lastLabel = packageHistory[packageHistory.length - 1].label;
        const lastVersion = parseInt(lastLabel.substring(1)); // Trim 'v' from the front
        return "v" + (lastVersion + 1);
    }
    deleteIsCurrentAccountProperty(map) {
        if (map) {
            Object.keys(map).forEach((key) => {
                delete map[key].isCurrentAccount;
            });
        }
    }
    static storageErrorHandler(azureError, overrideMessage = false, overrideCondition, overrideValue) {
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
    isAccessKeyValid(accessKey) {
        return this.setupPromise
            .then(() => {
            // Find the access key in the database
            return this.sequelize.models[exports.MODELS.ACCESSKEY].findOne({
                where: { name: accessKey }
            });
        })
            .then((accessKeyRecord) => {
            if (!accessKeyRecord) {
                return false;
            }
            // Check if the key has expired
            if (accessKeyRecord.dataValues.expires && accessKeyRecord.dataValues.expires < Date.now()) {
                return false;
            }
            return true;
        })
            .catch(() => {
            return false;
        });
    }
}
exports.S3Storage = S3Storage;

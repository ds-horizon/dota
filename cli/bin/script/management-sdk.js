"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const Q = require("q");
const superagent = require("superagent");
const recursiveFs = require("recursive-fs");
const yazl = require("yazl");
const slash = require("slash");
const ORG_FILE_PATH = path.resolve(__dirname, 'organisations.json');
var Promise = Q.Promise;
const packageJson = require("../../package.json");
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
function saveOrganizationsSync(orgs, forceSave = false) {
    try {
        // Check if file exists and is non-empty
        const fileExists = fs.existsSync(ORG_FILE_PATH);
        const isFileEmpty = fileExists && fs.readFileSync(ORG_FILE_PATH, 'utf-8').trim() === '';
        if (forceSave || !fileExists || isFileEmpty) {
            fs.writeFileSync(ORG_FILE_PATH, JSON.stringify(orgs, null, 2), 'utf-8');
            //console.log(`Organizations saved to ${ORG_FILE_PATH}`);
        }
        else {
            //console.log("Organizations already exist, skipping save.");
        }
    }
    catch (error) {
        console.error(`Error saving organizations: ${error.message}`);
    }
}
// Load organizations from the file (synchronous)
function loadOrganizationsSync() {
    try {
        if (fs.existsSync(ORG_FILE_PATH)) {
            const data = fs.readFileSync(ORG_FILE_PATH, 'utf-8');
            // console.log("data ::", data);
            return JSON.parse(data);
        }
        return [];
    }
    catch (error) {
        console.error(`Error loading organizations: ${error.message}`);
        return [];
    }
}
class AccountManager {
    static AppPermission = {
        OWNER: "Owner",
        COLLABORATOR: "Collaborator",
    };
    static SERVER_URL = "http://localhost:3000";
    static API_VERSION = 2;
    static ERROR_GATEWAY_TIMEOUT = 504; // Used if there is a network error
    static ERROR_INTERNAL_SERVER = 500;
    static ERROR_NOT_FOUND = 404;
    static ERROR_CONFLICT = 409; // Used if the resource already exists
    static ERROR_UNAUTHORIZED = 401;
    organisations = [];
    organisationsFetched = false;
    _accessKey;
    _serverUrl;
    _customHeaders;
    passedOrgName;
    constructor(accessKey, customHeaders, serverUrl) {
        if (!accessKey)
            throw new Error("An access key must be specified.");
        this._accessKey = accessKey;
        this._customHeaders = customHeaders;
        this._serverUrl = serverUrl || AccountManager.SERVER_URL;
        this.organisations = loadOrganizationsSync();
    }
    get accessKey() {
        return this._accessKey;
    }
    isAuthenticated(throwIfUnauthorized) {
        return Promise((resolve, reject, notify) => {
            const request = superagent.get(`${this._serverUrl}${urlEncode(["/authenticated"])}`);
            this.attachCredentials(request);
            request.end((err, res) => {
                const status = this.getErrorStatus(err, res);
                if (err && status !== AccountManager.ERROR_UNAUTHORIZED) {
                    reject(this.getCodePushError(err, res));
                    return;
                }
                const authenticated = status === 200;
                if (!authenticated && throwIfUnauthorized) {
                    reject(this.getCodePushError(err, res));
                    return;
                }
                resolve(authenticated);
            });
        });
    }
    //Tenants
    getTenants() {
        return this.get(urlEncode(["/tenants"])).then((res) => {
            this.organisations = res.body.organisations;
            saveOrganizationsSync(res.body.organisations, true);
            return res.body.organisations;
        });
    }
    getOrganisations() {
        return this.organisations;
    }
    getTenantId(tenantName) {
        if (!this.organisations || this.organisations.length === 0) {
            return "";
        }
        let tenantId = "";
        this.organisations.forEach((org) => {
            if (org.displayName === tenantName) {
                tenantId = org.id;
            }
        });
        return tenantId;
    }
    addAccessKey(friendlyName, ttl) {
        if (!friendlyName) {
            throw new Error("A name must be specified when adding an access key.");
        }
        const accessKeyRequest = {
            createdBy: os.hostname(),
            friendlyName,
            ttl,
        };
        return this.post(urlEncode(["/accessKeys/"]), JSON.stringify(accessKeyRequest), /*expectResponseBody=*/ true).then((response) => {
            return {
                createdTime: response.body.accessKey.createdTime,
                expires: response.body.accessKey.expires,
                key: response.body.accessKey.name,
                name: response.body.accessKey.friendlyName,
            };
        });
    }
    getAccessKey(accessKeyName) {
        return this.get(urlEncode([`/accessKeys/${accessKeyName}`])).then((res) => {
            return {
                createdTime: res.body.accessKey.createdTime,
                expires: res.body.accessKey.expires,
                name: res.body.accessKey.friendlyName,
            };
        });
    }
    getAccessKeys() {
        return this.get(urlEncode(["/accessKeys"])).then((res) => {
            const accessKeys = [];
            res.body.accessKeys.forEach((serverAccessKey) => {
                !serverAccessKey.isSession &&
                    accessKeys.push({
                        createdTime: serverAccessKey.createdTime,
                        expires: serverAccessKey.expires,
                        name: serverAccessKey.friendlyName,
                    });
            });
            return accessKeys;
        });
    }
    getSessions() {
        return this.get(urlEncode(["/accessKeys"])).then((res) => {
            // A machine name might be associated with multiple session keys,
            // but we should only return one per machine name.
            const sessionMap = {};
            const now = new Date().getTime();
            res.body.accessKeys.forEach((serverAccessKey) => {
                if (serverAccessKey.isSession && serverAccessKey.expires > now) {
                    sessionMap[serverAccessKey.createdBy] = {
                        loggedInTime: serverAccessKey.createdTime,
                        machineName: serverAccessKey.createdBy,
                    };
                }
            });
            const sessions = Object.keys(sessionMap).map((machineName) => sessionMap[machineName]);
            return sessions;
        });
    }
    patchAccessKey(oldName, newName, ttl) {
        const accessKeyRequest = {
            friendlyName: newName,
            ttl,
        };
        return this.patch(urlEncode([`/accessKeys/${oldName}`]), JSON.stringify(accessKeyRequest)).then((res) => {
            return {
                createdTime: res.body.accessKey.createdTime,
                expires: res.body.accessKey.expires,
                name: res.body.accessKey.friendlyName,
            };
        });
    }
    removeAccessKey(name) {
        return this.del(urlEncode([`/accessKeys/${name}`])).then(() => null);
    }
    removeSession(machineName) {
        return this.del(urlEncode([`/sessions/${machineName}`])).then(() => null);
    }
    // Account
    getAccountInfo() {
        return this.get(urlEncode(["/account"])).then((res) => res.body.account);
    }
    // Apps
    getApps() {
        //add tenant here
        return this.get(urlEncode(["/apps"])).then((res) => res.body.apps);
    }
    getApp(appName) {
        //add tenant here
        return this.get(urlEncode([`/apps/${appName}`])).then((res) => res.body.app);
    }
    addApp(appName) {
        //add tenant here
        const app = { name: appName };
        let tenantId = this.getTenantId(this.passedOrgName);
        if (tenantId && tenantId.length > 0) {
            app.organisation = {};
            app.organisation.orgId = tenantId;
        }
        else if (this.passedOrgName && this.passedOrgName.length > 0) {
            app.organisation = {};
            app.organisation.orgName = this.passedOrgName;
        }
        return this.post(urlEncode(["/apps/"]), JSON.stringify(app), /*expectResponseBody=*/ false).then(() => app);
    }
    removeApp(appName) {
        //add tenant here
        return this.del(urlEncode([`/apps/${appName}`])).then(() => null);
    }
    renameApp(oldAppName, newAppName) {
        //add tenant here
        return this.patch(urlEncode([`/apps/${oldAppName}`]), JSON.stringify({ name: newAppName })).then(() => null);
    }
    transferApp(appName, email) {
        return this.post(urlEncode([`/apps/${appName}/transfer/${email}`]), /*requestBody=*/ null, /*expectResponseBody=*/ false).then(() => null);
    }
    // Collaborators
    getCollaborators(appName) {
        return this.get(urlEncode([`/apps/${appName}/collaborators`])).then((res) => res.body.collaborators);
    }
    addCollaborator(appName, email) {
        return this.post(urlEncode([`/apps/${appName}/collaborators/${email}`]), 
        /*requestBody=*/ null, 
        /*expectResponseBody=*/ false).then(() => null);
    }
    removeCollaborator(appName, email) {
        return this.del(urlEncode([`/apps/${appName}/collaborators/${email}`])).then(() => null);
    }
    // Deployments
    addDeployment(appName, deploymentName, deploymentKey) {
        const deployment = { name: deploymentName, key: deploymentKey };
        return this.post(urlEncode([`/apps/${appName}/deployments/`]), JSON.stringify(deployment), /*expectResponseBody=*/ true).then((res) => res.body.deployment);
    }
    clearDeploymentHistory(appName, deploymentName) {
        return this.del(urlEncode([`/apps/${appName}/deployments/${deploymentName}/history`])).then(() => null);
    }
    getDeployments(appName) {
        return this.get(urlEncode([`/apps/${appName}/deployments/`])).then((res) => res.body.deployments);
    }
    getDeployment(appName, deploymentName) {
        return this.get(urlEncode([`/apps/${appName}/deployments/${deploymentName}`])).then((res) => res.body.deployment);
    }
    renameDeployment(appName, oldDeploymentName, newDeploymentName) {
        return this.patch(urlEncode([`/apps/${appName}/deployments/${oldDeploymentName}`]), JSON.stringify({ name: newDeploymentName })).then(() => null);
    }
    removeDeployment(appName, deploymentName) {
        return this.del(urlEncode([`/apps/${appName}/deployments/${deploymentName}`])).then(() => null);
    }
    getDeploymentMetrics(appName, deploymentName) {
        return this.get(urlEncode([`/apps/${appName}/deployments/${deploymentName}/metrics`])).then((res) => res.body.metrics);
    }
    getDeploymentHistory(appName, deploymentName) {
        return this.get(urlEncode([`/apps/${appName}/deployments/${deploymentName}/history`])).then((res) => res.body.history);
    }
    release(appName, deploymentName, filePath, targetBinaryVersion, updateMetadata, uploadProgressCallback) {
        return Promise((resolve, reject, notify) => {
            updateMetadata.appVersion = targetBinaryVersion;
            const request = superagent.post(this._serverUrl + urlEncode([`/apps/${appName}/deployments/${deploymentName}/release`]));
            this.attachCredentials(request);
            const getPackageFilePromise = Q.Promise((resolve, reject) => {
                this.packageFileFromPath(filePath)
                    .then((result) => {
                    resolve(result);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
            getPackageFilePromise.then((packageFile) => {
                const file = fs.createReadStream(packageFile.path);
                request
                    .attach("package", file)
                    .field("packageInfo", JSON.stringify(updateMetadata))
                    .on("progress", (event) => {
                    if (uploadProgressCallback && event && event.total > 0) {
                        const currentProgress = (event.loaded / event.total) * 100;
                        uploadProgressCallback(currentProgress);
                    }
                })
                    .end((err, res) => {
                    if (packageFile.isTemporary) {
                        fs.unlinkSync(packageFile.path);
                    }
                    if (err) {
                        reject(this.getCodePushError(err, res));
                        return;
                    }
                    if (res.ok) {
                        resolve(null);
                    }
                    else {
                        let body;
                        try {
                            body = JSON.parse(res.text);
                        }
                        catch (err) { }
                        if (body) {
                            reject({
                                message: body.message,
                                statusCode: res && res.status,
                            });
                        }
                        else {
                            reject({
                                message: res.text,
                                statusCode: res && res.status,
                            });
                        }
                    }
                });
            });
        });
    }
    patchRelease(appName, deploymentName, label, updateMetadata) {
        updateMetadata.label = label;
        const requestBody = JSON.stringify({ packageInfo: updateMetadata });
        return this.patch(urlEncode([`/apps/${appName}/deployments/${deploymentName}/release`]), requestBody, 
        /*expectResponseBody=*/ false).then(() => null);
    }
    promote(appName, sourceDeploymentName, destinationDeploymentName, updateMetadata) {
        const requestBody = JSON.stringify({ packageInfo: updateMetadata });
        return this.post(urlEncode([`/apps/${appName}/deployments/${sourceDeploymentName}/promote/${destinationDeploymentName}`]), requestBody, 
        /*expectResponseBody=*/ false).then(() => null);
    }
    rollback(appName, deploymentName, targetRelease) {
        return this.post(urlEncode([`/apps/${appName}/deployments/${deploymentName}/rollback/${targetRelease || ``}`]), 
        /*requestBody=*/ null, 
        /*expectResponseBody=*/ false).then(() => null);
    }
    packageFileFromPath(filePath) {
        let getPackageFilePromise;
        if (fs.lstatSync(filePath).isDirectory()) {
            getPackageFilePromise = Promise((resolve, reject) => {
                const directoryPath = filePath;
                recursiveFs.readdirr(directoryPath, (error, directories, files) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const baseDirectoryPath = path.dirname(directoryPath);
                    const fileName = this.generateRandomFilename(15) + ".zip";
                    const zipFile = new yazl.ZipFile();
                    const writeStream = fs.createWriteStream(fileName);
                    zipFile.outputStream
                        .pipe(writeStream)
                        .on("error", (error) => {
                        reject(error);
                    })
                        .on("close", () => {
                        filePath = path.join(process.cwd(), fileName);
                        resolve({ isTemporary: true, path: filePath });
                    });
                    for (let i = 0; i < files.length; ++i) {
                        const file = files[i];
                        // yazl does not like backslash (\) in the metadata path.
                        const relativePath = slash(path.relative(baseDirectoryPath, file));
                        zipFile.addFile(file, relativePath);
                    }
                    zipFile.end();
                });
            });
        }
        else {
            getPackageFilePromise = Q({ isTemporary: false, path: filePath });
        }
        return getPackageFilePromise;
    }
    generateRandomFilename(length) {
        let filename = "";
        const validChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            filename += validChar.charAt(Math.floor(Math.random() * validChar.length));
        }
        return filename;
    }
    get(endpoint, expectResponseBody = true) {
        return this.makeApiRequest("get", endpoint, /*requestBody=*/ null, expectResponseBody, /*contentType=*/ null);
    }
    post(endpoint, requestBody, expectResponseBody, contentType = "application/json;charset=UTF-8") {
        return this.makeApiRequest("post", endpoint, requestBody, expectResponseBody, contentType);
    }
    patch(endpoint, requestBody, expectResponseBody = false, contentType = "application/json;charset=UTF-8") {
        return this.makeApiRequest("patch", endpoint, requestBody, expectResponseBody, contentType);
    }
    del(endpoint, expectResponseBody = false) {
        return this.makeApiRequest("del", endpoint, /*requestBody=*/ null, expectResponseBody, /*contentType=*/ null);
    }
    makeApiRequest(method, endpoint, requestBody, expectResponseBody, contentType) {
        return Promise((resolve, reject, notify) => {
            let request = superagent[method](this._serverUrl + endpoint);
            this.attachCredentials(request);
            if (requestBody) {
                if (contentType) {
                    request = request.set("Content-Type", contentType);
                }
                request = request.send(requestBody);
            }
            request.end((err, res) => {
                if (err) {
                    reject(this.getCodePushError(err, res));
                    return;
                }
                let body;
                try {
                    body = JSON.parse(res.text);
                }
                catch (err) { }
                if (res.ok) {
                    if (expectResponseBody && !body) {
                        reject({
                            message: `Could not parse response: ${res.text}`,
                            statusCode: AccountManager.ERROR_INTERNAL_SERVER,
                        });
                    }
                    else {
                        resolve({
                            headers: res.header,
                            body: body,
                        });
                    }
                }
                else {
                    if (body) {
                        reject({
                            message: body.message,
                            statusCode: this.getErrorStatus(err, res),
                        });
                    }
                    else {
                        reject({
                            message: res.text,
                            statusCode: this.getErrorStatus(err, res),
                        });
                    }
                }
            });
        });
    }
    getCodePushError(error, response) {
        if (error.syscall === "getaddrinfo") {
            error.message = `Unable to connect to the Dota server. Are you offline, or behind a firewall or proxy?\n(${error.message})`;
        }
        return {
            message: this.getErrorMessage(error, response),
            statusCode: this.getErrorStatus(error, response),
        };
    }
    getErrorStatus(error, response) {
        return (error && error.status) || (response && response.status) || AccountManager.ERROR_GATEWAY_TIMEOUT;
    }
    getErrorMessage(error, response) {
        return response && response.text ? response.text : error.message;
    }
    attachCredentials(request) {
        if (this._customHeaders) {
            for (const headerName in this._customHeaders) {
                request.set(headerName, this._customHeaders[headerName]);
            }
        }
        // console.log("this.organisations ::", this.organisations);
        // console.log("this.passedOrgName ::", this.passedOrgName);
        if (this.passedOrgName && this.passedOrgName.length > 0) {
            let tenantId = this.getTenantId(this.passedOrgName);
            request.set("tenant", tenantId);
        }
        let bearerToken = "cli-" + this._accessKey;
        request.set("Accept", `application/vnd.code-push.v${AccountManager.API_VERSION}+json`);
        request.set("Authorization", `Bearer ${bearerToken}`);
        request.set("X-CodePush-SDK-Version", packageJson.version);
    }
}
module.exports = AccountManager;

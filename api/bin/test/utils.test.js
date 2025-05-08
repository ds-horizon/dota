"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveStringContentsFromUrl = exports.getStreamAndSizeForFile = exports.makeStringFromStream = exports.makeStreamFromString = exports.makePackage = exports.makeRestDeployment = exports.makeStorageDeployment = exports.makeRestApp = exports.makeStorageApp = exports.makeAccessKeyRequest = exports.makeStorageAccessKey = exports.makeAccount = exports.generateKey = void 0;
const fs = require("fs");
const http = require("http");
const https = require("https");
const shortid = require("shortid");
const stream = require("stream");
const ACCESS_KEY_EXPIRY = 1000 * 60 * 60 * 24 * 60; // 60 days.
function generateKey() {
    return shortid.generate() + shortid.generate(); // The REST API validates that keys must be at least 10 characters long
}
exports.generateKey = generateKey;
function makeAccount() {
    var account = {
        createdTime: new Date().getTime(),
        name: "test account",
        email: "test_" + shortid.generate() + "@email.com",
    };
    return account;
}
exports.makeAccount = makeAccount;
function makeStorageAccessKey() {
    var now = new Date().getTime();
    var friendlyName = shortid.generate();
    var accessKey = {
        name: generateKey(),
        createdTime: now,
        createdBy: "test machine",
        friendlyName: friendlyName,
        description: friendlyName,
        expires: now + ACCESS_KEY_EXPIRY,
    };
    return accessKey;
}
exports.makeStorageAccessKey = makeStorageAccessKey;
function makeAccessKeyRequest() {
    var accessKeyRequest = {
        name: generateKey(),
        createdBy: "test machine",
        friendlyName: shortid.generate(),
        ttl: ACCESS_KEY_EXPIRY,
    };
    return accessKeyRequest;
}
exports.makeAccessKeyRequest = makeAccessKeyRequest;
function makeStorageApp() {
    var app = {
        createdTime: new Date().getDate(),
        name: shortid.generate(),
    };
    return app;
}
exports.makeStorageApp = makeStorageApp;
function makeRestApp() {
    var app = {
        name: shortid.generate(),
        deployments: ["Production", "Staging"],
    };
    return app;
}
exports.makeRestApp = makeRestApp;
function makeStorageDeployment() {
    var deployment = {
        createdTime: new Date().getDate(),
        name: shortid.generate(),
        key: generateKey(),
    };
    return deployment;
}
exports.makeStorageDeployment = makeStorageDeployment;
function makeRestDeployment() {
    var deployment = {
        name: shortid.generate(),
    };
    return deployment;
}
exports.makeRestDeployment = makeRestDeployment;
function makePackage(version, isMandatory, packageHash, label) {
    var storagePackage = {
        blobUrl: "testUrl.com",
        description: "test blob id",
        isDisabled: false,
        isMandatory: isMandatory || false,
        rollout: null,
        appVersion: version || "test blob id",
        label: label || null,
        packageHash: packageHash || "hash123_n",
        size: 1,
        manifestBlobUrl: "test manifest blob URL",
        uploadTime: new Date().getTime(),
    };
    return storagePackage;
}
exports.makePackage = makePackage;
function makeStreamFromString(stringValue) {
    var blobStream = new stream.Readable();
    blobStream.push(stringValue);
    blobStream.push(null);
    return blobStream;
}
exports.makeStreamFromString = makeStreamFromString;
function makeStringFromStream(stream) {
    var stringValue = "";
    return new Promise((resolve) => {
        stream
            .on("data", (data) => {
            stringValue += data;
        })
            .on("end", () => {
            resolve(stringValue);
        });
    });
}
exports.makeStringFromStream = makeStringFromStream;
function getStreamAndSizeForFile(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }
            var readable = fs.createReadStream(path);
            resolve({ stream: readable, size: stats.size });
        });
    });
}
exports.getStreamAndSizeForFile = getStreamAndSizeForFile;
function retrieveStringContentsFromUrl(url) {
    // Parse the URL to get components
    const parsedUrl = new URL(url);
    // Determine protocol
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    return new Promise((resolve) => {
        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET'
        };
        protocol
            .get(requestOptions, (response) => {
            if (response.statusCode !== 200) {
                resolve(null);
                return;
            }
            makeStringFromStream(response).then((contents) => {
                resolve(contents);
            });
        })
            .on("error", (error) => {
            resolve(null);
        });
    });
}
exports.retrieveStringContentsFromUrl = retrieveStringContentsFromUrl;

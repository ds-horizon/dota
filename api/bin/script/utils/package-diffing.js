"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageDiffer = void 0;
const diffErrorUtils = require("./diff-error-handling");
const env = require("../environment");
const fs = require("fs");
const hashUtils = require("../utils/hash-utils");
const path = require("path");
const security = require("../utils/security");
const semver = require("semver");
const stream = require("stream");
const streamifier = require("streamifier");
const superagent = require("superagent");
const yazl = require("yazl");
const yauzl = require("yauzl");
var PackageManifest = hashUtils.PackageManifest;
const request = require("superagent");
class PackageDiffer {
    static MANIFEST_FILE_NAME = "hotcodepush.json";
    static WORK_DIRECTORY_PATH = env.getTempDirectory();
    static IS_WORK_DIRECTORY_CREATED = false;
    _storage;
    _maxPackagesToDiff;
    constructor(storage, maxPackagesToDiff) {
        this._maxPackagesToDiff = maxPackagesToDiff || 1;
        this._storage = storage;
    }
    generateDiffPackageMap(accountId, appId, deploymentId, newPackage) {
        if (!newPackage || !newPackage.blobUrl || !newPackage.manifestBlobUrl) {
            return Promise.reject(diffErrorUtils.diffError(diffErrorUtils.ErrorCode.InvalidArguments, "Package information missing"));
        }
        const manifestPromise = this.getManifest(newPackage);
        const historyPromise = this._storage.getPackageHistory(accountId, appId, deploymentId);
        const newReleaseFilePromise = this.downloadArchiveFromUrl(newPackage.blobUrl);
        let newFilePath;
        return Promise
            .all([manifestPromise, historyPromise, newReleaseFilePromise])
            .then(([newManifest, history, downloadedArchiveFile]) => {
            newFilePath = downloadedArchiveFile;
            const packagesToDiff = this.getPackagesToDiff(history, newPackage.appVersion, newPackage.packageHash, newPackage.label);
            const diffBlobInfoPromises = [];
            if (packagesToDiff) {
                packagesToDiff.forEach((appPackage) => {
                    diffBlobInfoPromises.push(this.uploadAndGetDiffBlobInfo(accountId, appPackage, newPackage.packageHash, newManifest, newFilePath));
                });
            }
            return Promise.all(diffBlobInfoPromises);
        })
            .then((diffBlobInfoList) => {
            // all done, delete the downloaded archive file.
            fs.unlinkSync(newFilePath);
            if (diffBlobInfoList && diffBlobInfoList.length) {
                let diffPackageMap = null;
                diffBlobInfoList.forEach((diffBlobInfo) => {
                    if (diffBlobInfo && diffBlobInfo.blobInfo) {
                        diffPackageMap = diffPackageMap || {};
                        diffPackageMap[diffBlobInfo.packageHash] = diffBlobInfo.blobInfo;
                    }
                });
                return diffPackageMap;
            }
            else {
                return Promise.resolve((null));
            }
        })
            .catch(diffErrorUtils.diffErrorHandler);
    }
    generateDiffArchive(oldManifest, newManifest, newArchiveFilePath) {
        return new Promise((resolve, reject) => {
            if (!oldManifest || !newManifest) {
                resolve(null);
                return;
            }
            const diff = PackageDiffer.generateDiff(oldManifest.toMap(), newManifest.toMap());
            if (diff.deletedFiles.length === 0 && diff.newOrUpdatedEntries.size === 0) {
                resolve(null);
                return;
            }
            PackageDiffer.ensureWorkDirectoryExists();
            const diffFilePath = path.join(PackageDiffer.WORK_DIRECTORY_PATH, "diff_" + PackageDiffer.randomString(20) + ".zip");
            const writeStream = fs.createWriteStream(diffFilePath);
            const diffFile = new yazl.ZipFile();
            diffFile.outputStream.pipe(writeStream).on("close", () => {
                // This will be called after diffFile.end() is called and all content is written
                resolve(diffFilePath);
            });
            const json = JSON.stringify({ deletedFiles: diff.deletedFiles });
            const readStream = streamifier.createReadStream(json);
            diffFile.addReadStream(readStream, PackageDiffer.MANIFEST_FILE_NAME);
            if (diff.newOrUpdatedEntries.size > 0) {
                yauzl.open(newArchiveFilePath, (error, zipFile) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // Using an array to track entries we need to add
                    const entriesToAdd = Array.from(diff.newOrUpdatedEntries.keys());
                    const entriesAdded = new Set();
                    // Process all entries and add what's needed
                    const pendingEntries = new Set();
                    // Function to check if we've added all entries
                    const checkAllEntriesAdded = () => {
                        if (entriesAdded.size === entriesToAdd.length && pendingEntries.size === 0) {
                            diffFile.end();
                        }
                    };
                    zipFile.on("error", (error) => {
                        reject(error);
                    });
                    zipFile.on("entry", (entry) => {
                        // Check if we should include this entry
                        if (!entriesToAdd.includes(entry.fileName)) {
                            return;
                        }
                        // Handle directory entries
                        if (/\/$/.test(entry.fileName)) {
                            diffFile.addEmptyDirectory(entry.fileName);
                            entriesAdded.add(entry.fileName);
                            checkAllEntriesAdded();
                            return;
                        }
                        // Add the entry to pending set while we process it
                        pendingEntries.add(entry.fileName);
                        zipFile.openReadStream(entry, (error, readStream) => {
                            if (error) {
                                pendingEntries.delete(entry.fileName);
                                reject(error);
                                return;
                            }
                            readStream.on("error", (error) => {
                                pendingEntries.delete(entry.fileName);
                                reject(error);
                            });
                            // Add the entry to the diff file
                            diffFile.addReadStream(readStream, entry.fileName, {
                                compress: true
                            });
                            // Mark this entry as added when the stream ends
                            readStream.on("end", () => {
                                entriesAdded.add(entry.fileName);
                                pendingEntries.delete(entry.fileName);
                                checkAllEntriesAdded();
                            });
                        });
                    });
                    // When all zip entries have been processed, check if we've added all required entries
                    zipFile.on("end", () => {
                        // If no pending entries left, end the diff file
                        if (pendingEntries.size === 0) {
                            checkAllEntriesAdded();
                        }
                    });
                });
            }
            else {
                diffFile.end();
            }
        });
    }
    uploadDiffArchiveBlob(blobId, diffArchiveFilePath) {
        return new Promise((resolve, reject) => {
            fs.stat(diffArchiveFilePath, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                const readable = fs.createReadStream(diffArchiveFilePath);
                this._storage
                    .addBlob(blobId, readable, stats.size)
                    .then((blobId) => {
                    return this._storage.getBlobUrl(blobId);
                })
                    .then((blobUrl) => {
                    fs.unlink(diffArchiveFilePath, (error) => {
                        if (error) {
                            console.error("Error occurred while unlinking file:", error);
                        }
                    });
                    const diffBlobInfo = { size: stats.size, url: blobUrl };
                    resolve(diffBlobInfo);
                })
                    .catch(() => {
                    resolve(null);
                });
            });
        });
    }
    uploadAndGetDiffBlobInfo(accountId, appPackage, newPackageHash, newManifest, newFilePath) {
        if (!appPackage || appPackage.packageHash === newPackageHash) {
            // If the packageHash matches, no need to calculate diff, its the same package.
            return Promise.resolve((null));
        }
        return this.getManifest(appPackage)
            .then((existingManifest) => {
            return this.generateDiffArchive(existingManifest, newManifest, newFilePath);
        })
            .then((diffArchiveFilePath) => {
            if (diffArchiveFilePath) {
                return this.uploadDiffArchiveBlob(security.generateSecureKey(accountId), diffArchiveFilePath);
            }
            return Promise.resolve(null);
        })
            .then((blobInfo) => {
            if (blobInfo) {
                return { packageHash: appPackage.packageHash, blobInfo: blobInfo };
            }
            else {
                return Promise.resolve((null));
            }
        });
    }
    getManifest(appPackage) {
        return new Promise((resolve, _reject) => {
            if (!appPackage || !appPackage.manifestBlobUrl) {
                resolve(null);
                return;
            }
            const req = superagent.get(appPackage.manifestBlobUrl);
            const writeStream = new stream.Writable();
            let json = "";
            writeStream._write = (data, encoding, callback) => {
                json += data.toString("utf8");
                callback();
            };
            req.pipe(writeStream).on("finish", () => {
                const manifest = PackageManifest.deserialize(json);
                resolve(manifest);
            });
        });
    }
    downloadArchiveFromUrl(url) {
        return new Promise((resolve) => {
            PackageDiffer.ensureWorkDirectoryExists();
            const downloadedArchiveFilePath = path.join(PackageDiffer.WORK_DIRECTORY_PATH, "temp_" + PackageDiffer.randomString(20) + ".zip");
            const writeStream = fs.createWriteStream(downloadedArchiveFilePath);
            const req = request.get(url);
            req.pipe(writeStream).on("finish", () => {
                resolve(downloadedArchiveFilePath);
            });
        });
    }
    getPackagesToDiff(history, appVersion, newPackageHash, newPackageLabel) {
        if (!history || !history.length) {
            return null;
        }
        // We assume that the new package has been released and already is in history.
        // Only pick the packages that are released before the new package to generate diffs.
        let foundNewPackageInHistory = false;
        const validPackages = [];
        for (let i = history.length - 1; i >= 0; i--) {
            if (!foundNewPackageInHistory) {
                foundNewPackageInHistory = history[i].label === newPackageLabel;
                continue;
            }
            if (validPackages.length === this._maxPackagesToDiff) {
                break;
            }
            const isMatchingAppVersion = PackageDiffer.isMatchingAppVersion(appVersion, history[i].appVersion);
            if (isMatchingAppVersion && history[i].packageHash !== newPackageHash) {
                validPackages.push(history[i]);
            }
        }
        // maintain the order of release.
        return validPackages.reverse();
    }
    static generateDiff(oldFileHashes, newFileHashes) {
        const diff = { deletedFiles: [], newOrUpdatedEntries: new Map() };
        newFileHashes.forEach((hash, name) => {
            if (!PackageDiffer.isEntryInMap(name, hash, oldFileHashes, /*requireContentMatch*/ true)) {
                diff.newOrUpdatedEntries.set(name, hash);
            }
        });
        oldFileHashes.forEach((hash, name) => {
            if (!PackageDiffer.isEntryInMap(name, hash, newFileHashes, /*requireContentMatch*/ false)) {
                diff.deletedFiles.push(name);
            }
        });
        return diff;
    }
    static isMatchingAppVersion(baseAppVersion, newAppVersion) {
        let isMatchingAppVersion = false;
        if (!semver.valid(baseAppVersion)) {
            // baseAppVersion is a semver range
            if (!semver.valid(newAppVersion)) {
                // newAppVersion is a semver range
                isMatchingAppVersion = semver.validRange(newAppVersion) === semver.validRange(baseAppVersion);
            }
            else {
                // newAppVersion is not a semver range
                isMatchingAppVersion = semver.satisfies(newAppVersion, baseAppVersion);
            }
        }
        else {
            // baseAppVersion is not a semver range
            isMatchingAppVersion = semver.satisfies(baseAppVersion, newAppVersion);
        }
        return isMatchingAppVersion;
    }
    static ensureWorkDirectoryExists() {
        if (!PackageDiffer.IS_WORK_DIRECTORY_CREATED) {
            if (!fs.existsSync(PackageDiffer.WORK_DIRECTORY_PATH)) {
                fs.mkdirSync(PackageDiffer.WORK_DIRECTORY_PATH);
            }
            // Memoize this check to avoid unnecessary file system access.
            PackageDiffer.IS_WORK_DIRECTORY_CREATED = true;
        }
    }
    static isEntryInMap(name, hash, map, requireContentMatch) {
        const hashInMap = map.get(name);
        return requireContentMatch ? hashInMap === hash : !!hashInMap;
    }
    static randomString(length) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
}
exports.PackageDiffer = PackageDiffer;

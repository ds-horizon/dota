"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBinaryOrZip = isBinaryOrZip;
exports.isDirectory = isDirectory;
exports.fileExists = fileExists;
exports.copyFileToTmpDir = copyFileToTmpDir;
exports.fileDoesNotExistOrIsDirectory = fileDoesNotExistOrIsDirectory;
exports.normalizePath = normalizePath;
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const temp = require("temp");
function isBinaryOrZip(path) {
    return path.search(/\.zip$/i) !== -1 || path.search(/\.apk$/i) !== -1 || path.search(/\.ipa$/i) !== -1;
}
function isDirectory(path) {
    return fs.statSync(path).isDirectory();
}
function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    }
    catch (e) {
        return false;
    }
}
;
function copyFileToTmpDir(filePath) {
    if (!isDirectory(filePath)) {
        const outputFolderPath = temp.mkdirSync("code-push");
        rimraf.sync(outputFolderPath);
        fs.mkdirSync(outputFolderPath);
        const outputFilePath = path.join(outputFolderPath, path.basename(filePath));
        fs.writeFileSync(outputFilePath, fs.readFileSync(filePath));
        return outputFolderPath;
    }
}
function fileDoesNotExistOrIsDirectory(path) {
    try {
        return isDirectory(path);
    }
    catch (error) {
        return true;
    }
}
function normalizePath(filePath) {
    //replace all backslashes coming from cli running on windows machines by slashes
    return filePath.replace(/\\/g, "/");
}

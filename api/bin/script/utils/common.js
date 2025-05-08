"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashWithSHA256 = exports.streamToBufferS3 = exports.streamToBuffer = exports.convertObjectToSnakeCase = void 0;
const streamToArray = require("stream-to-array");
const crypto = require("crypto");
function toSnakeCase(str) {
    return str
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toLowerCase();
}
function convertObjectToSnakeCase(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => convertObjectToSnakeCase(item));
    }
    return Object.keys(obj).reduce((acc, key) => {
        const snakeCaseKey = toSnakeCase(key);
        acc[snakeCaseKey] = convertObjectToSnakeCase(obj[key]);
        return acc;
    }, {});
}
exports.convertObjectToSnakeCase = convertObjectToSnakeCase;
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        streamToArray(readableStream, (err, arr) => {
            if (err) {
                reject(err);
            }
            else {
                const buffers = arr.map((chunk) => (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
                const concatenatedBuffer = Buffer.concat(buffers);
                resolve(concatenatedBuffer.buffer);
            }
        });
    });
}
exports.streamToBuffer = streamToBuffer;
async function streamToBufferS3(readableStream) {
    return new Promise((resolve, reject) => {
        streamToArray(readableStream, (err, arr) => {
            if (err) {
                reject(err);
            }
            else {
                // Ensure all chunks are Buffers
                const buffers = arr.map((chunk) => (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
                // Concatenate all chunks into a single Buffer
                resolve(Buffer.concat(buffers));
            }
        });
    });
}
exports.streamToBufferS3 = streamToBufferS3;
function hashWithSHA256(input) {
    const hash = crypto.createHash("sha256");
    hash.update(input);
    return hash.digest("hex");
}
exports.hashWithSHA256 = hashWithSHA256;

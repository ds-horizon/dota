"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createTempFileFromBuffer = exports.getFileWithField = exports.fileUploadMiddleware = void 0;
const multer = require("multer");
const UPLOAD_SIZE_LIMIT_MB = parseInt(process.env.UPLOAD_SIZE_LIMIT_MB) || 200;
function getAttachUploadFileFunction(maxFileSizeMb) {
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: maxFileSizeMb * 1048576,
        },
    }).any();
}
function fileUploadMiddleware(req, res, next) {
    const maxFileSizeMb = UPLOAD_SIZE_LIMIT_MB;
    const attachUploadFile = getAttachUploadFileFunction(maxFileSizeMb);
    attachUploadFile(req, res, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                res.status(413).send(`The uploaded file is larger than the size limit of ${maxFileSizeMb} megabytes.`);
            }
            else {
                next(err);
            }
        }
        else {
            next();
        }
    });
}
exports.fileUploadMiddleware = fileUploadMiddleware;
function getFileWithField(req, field) {
    for (const i in req.files) {
        if (req.files[i].fieldname === field) {
            return req.files[i];
        }
    }
    return null;
}
exports.getFileWithField = getFileWithField;
function createTempFileFromBuffer(buffer) {
    const tempDir = require("os").tmpdir();
    const uniqueFilename = `tempfile_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const filePath = require("path").join(tempDir, uniqueFilename);
    require("fs").writeFileSync(filePath, buffer);
    return filePath;
}
exports.createTempFileFromBuffer = createTempFileFromBuffer;

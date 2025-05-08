"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSanitizer = void 0;
function InputSanitizer(req, res, next) {
    if (req.query) {
        req.query.deploymentKey = trimInvalidCharacters((req.query.deploymentKey || req.query.deployment_key));
    }
    next();
}
exports.InputSanitizer = InputSanitizer;
function trimInvalidCharacters(text) {
    return text && text.trim();
}

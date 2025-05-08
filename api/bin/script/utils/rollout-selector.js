"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnfinishedRollout = exports.isSelectedForRollout = void 0;
const DELIMITER = "-";
function getHashCode(input) {
    let hash = 0;
    if (input.length === 0) {
        return hash;
    }
    for (let i = 0; i < input.length; i++) {
        const chr = input.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
    }
    return hash;
}
function isSelectedForRollout(clientId, rollout, releaseTag) {
    const identifier = clientId + DELIMITER + releaseTag;
    const hashValue = getHashCode(identifier);
    return Math.abs(hashValue) % 100 < rollout;
}
exports.isSelectedForRollout = isSelectedForRollout;
function isUnfinishedRollout(rollout) {
    return rollout && rollout !== 100;
}
exports.isUnfinishedRollout = isUnfinishedRollout;

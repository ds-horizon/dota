"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandType = void 0;
exports.parseAppName = parseAppName;
var CommandType;
(function (CommandType) {
    CommandType[CommandType["accessKeyAdd"] = 0] = "accessKeyAdd";
    CommandType[CommandType["accessKeyPatch"] = 1] = "accessKeyPatch";
    CommandType[CommandType["accessKeyList"] = 2] = "accessKeyList";
    CommandType[CommandType["accessKeyRemove"] = 3] = "accessKeyRemove";
    CommandType[CommandType["orgList"] = 4] = "orgList";
    CommandType[CommandType["appAdd"] = 5] = "appAdd";
    CommandType[CommandType["appList"] = 6] = "appList";
    CommandType[CommandType["appRemove"] = 7] = "appRemove";
    CommandType[CommandType["appRename"] = 8] = "appRename";
    CommandType[CommandType["appTransfer"] = 9] = "appTransfer";
    CommandType[CommandType["collaboratorAdd"] = 10] = "collaboratorAdd";
    CommandType[CommandType["collaboratorList"] = 11] = "collaboratorList";
    CommandType[CommandType["collaboratorRemove"] = 12] = "collaboratorRemove";
    CommandType[CommandType["debug"] = 13] = "debug";
    CommandType[CommandType["deploymentAdd"] = 14] = "deploymentAdd";
    CommandType[CommandType["deploymentHistory"] = 15] = "deploymentHistory";
    CommandType[CommandType["deploymentHistoryClear"] = 16] = "deploymentHistoryClear";
    CommandType[CommandType["deploymentList"] = 17] = "deploymentList";
    CommandType[CommandType["deploymentMetrics"] = 18] = "deploymentMetrics";
    CommandType[CommandType["deploymentRemove"] = 19] = "deploymentRemove";
    CommandType[CommandType["deploymentRename"] = 20] = "deploymentRename";
    CommandType[CommandType["link"] = 21] = "link";
    CommandType[CommandType["login"] = 22] = "login";
    CommandType[CommandType["logout"] = 23] = "logout";
    CommandType[CommandType["patch"] = 24] = "patch";
    CommandType[CommandType["promote"] = 25] = "promote";
    CommandType[CommandType["register"] = 26] = "register";
    CommandType[CommandType["release"] = 27] = "release";
    CommandType[CommandType["releaseReact"] = 28] = "releaseReact";
    CommandType[CommandType["rollback"] = 29] = "rollback";
    CommandType[CommandType["sessionList"] = 30] = "sessionList";
    CommandType[CommandType["sessionRemove"] = 31] = "sessionRemove";
    CommandType[CommandType["whoami"] = 32] = "whoami";
})(CommandType || (exports.CommandType = CommandType = {}));
function parseAppName(appName) {
    const [ownerName, app] = appName.includes('/')
        ? appName.split('/')
        : [null, appName];
    return { ownerName, appName: app };
}

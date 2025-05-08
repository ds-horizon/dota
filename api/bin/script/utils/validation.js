"use strict";

const security_1 = require("./security");
const semver = require("semver");
const emailValidator = require("email-validator");
var Validation;
(function (Validation) {
    function getStringValidator(maxLength = 1000, minLength = 0) {
        return function isValidString(value) {
            if (typeof value !== "string") {
                return false;
            }
            if (maxLength > 0 && value.length > maxLength) {
                return false;
            }
            return value.length >= minLength;
        };
    }
    function isValidAppVersionField(appVersion) {
        return appVersion && semver.valid(appVersion) !== null;
    }
    Validation.isValidAppVersionField = isValidAppVersionField;
    function isValidAppVersionRangeField(appVersion) {
        return !!semver.validRange(appVersion);
    }
    function isValidBooleanField(val) {
        return typeof val === "boolean";
    }
    function isValidLabelField(val) {
        return val && val.match(/^v[1-9][0-9]*$/) !== null; //validates if label field confirms to 'v1-v9999...' standard
    }
    function isValidEmailField(email) {
        return (getStringValidator(/*maxLength=*/ 255, /*minLength=*/ 1)(email) &&
            emailValidator.validate(email) &&
            !/[\\\/\?]/.test(email) && // Forbid URL special characters until #374 is resolved
            !/[\x00-\x1F]/.test(email) && // Control characters
            !/[\x7F-\x9F]/.test(email) &&
            !/#/.test(email) && // The Azure Storage library forbids this in PartitionKeys (in addition to the above)
            !/[ \*]/.test(email) && // Our storage layer currently forbids these characters in PartitionKeys
            !/:/.test(email)); // Forbid colon because we use it as a delimiter for qualified app names
    }
    function isValidTtlField(allowZero, val) {
        return !isNaN(val) && val >= 0 && (val != 0 || allowZero);
    }
    function isValidKeyField(val) {
        return getStringValidator(/*maxLength=*/ 100, /*minLength=*/ 10)(val) && security_1.ALLOWED_KEY_CHARACTERS_TEST.test(val);
    }
    Validation.isValidKeyField = isValidKeyField;
    function isValidNameField(name) {
        return (getStringValidator(/*maxLength=*/ 1000, /*minLength=*/ 1)(name) &&
            !/[\\\/\?]/.test(name) && // Forbid URL special characters until #374 is resolved
            !/[\x00-\x1F]/.test(name) && // Control characters
            !/[\x7F-\x9F]/.test(name) &&
            !/:/.test(name)); // Forbid colon because we use it as a delimiter for qualified app names
    }
    function isValidRolloutField(rollout) {
        // rollout is an optional field, or when defined should be a number between 1-100.
        return /^(100|[1-9][0-9]|[1-9])$/.test(rollout);
    }
    Validation.isValidRolloutField = isValidRolloutField;
    const isValidDescriptionField = getStringValidator(/*maxLength=*/ 10000);
    const isValidFriendlyNameField = getStringValidator(/*maxLength=*/ 10000, /*minLength*/ 1);
    function isValidUpdateCheckRequest(updateCheckRequest) {
        const fields = {
            appVersion: isValidAppVersionField,
            deploymentKey: isValidKeyField,
        };
        const requiredFields = ["appVersion", "deploymentKey"];
        return validate(updateCheckRequest, fields, requiredFields).length === 0;
    }
    Validation.isValidUpdateCheckRequest = isValidUpdateCheckRequest;
    function validateAccessKeyRequest(accessKey, isUpdate) {
        const fields = {
            friendlyName: isValidFriendlyNameField,
            ttl: isValidTtlField.bind(/*thisArg*/ null, /*allowZero*/ isUpdate),
        };
        let requiredFields = [];
        if (!isUpdate) {
            fields["name"] = isValidKeyField;
            requiredFields = ["name", "friendlyName"];
        }
        return validate(accessKey, fields, requiredFields);
    }
    Validation.validateAccessKeyRequest = validateAccessKeyRequest;
    function validateAccount(account, isUpdate) {
        const fields = {
            email: isValidEmailField,
            name: getStringValidator(/*maxLength=*/ 1000, /*minLength=*/ 1),
        };
        let requiredFields = [];
        if (!isUpdate) {
            requiredFields = ["name"];
        }
        return validate(account, fields, requiredFields);
    }
    Validation.validateAccount = validateAccount;
    function validateApp(app, isUpdate) {
        const fields = {
            name: isValidNameField, // During creation/modification, the app's 'name' field will never be qualified with an email
        };
        let requiredFields = [];
        if (!isUpdate) {
            requiredFields = ["name"];
        }
        return validate(app, fields, requiredFields);
    }
    Validation.validateApp = validateApp;
    function validateDeployment(deployment, isUpdate) {
        const fields = {
            name: isValidNameField,
            key: isValidKeyField,
        };
        let requiredFields = [];
        if (!isUpdate) {
            requiredFields = ["name"];
        }
        return validate(deployment, fields, requiredFields);
    }
    Validation.validateDeployment = validateDeployment;
    function validatePackageInfo(packageInfo, allOptional) {
        const fields = {
            appVersion: isValidAppVersionRangeField,
            description: isValidDescriptionField,
            label: isValidLabelField,
            isDisabled: isValidBooleanField,
            isMandatory: isValidBooleanField,
            rollout: isValidRolloutField,
        };
        let requiredFields = [];
        if (!allOptional) {
            requiredFields = ["appVersion"];
        }
        return validate(packageInfo, fields, requiredFields);
    }
    Validation.validatePackageInfo = validatePackageInfo;
    function validate(obj, fieldValidators, requiredFields = []) {
        const errors = [];
        Object.keys(fieldValidators).forEach((fieldName) => {
            const validator = fieldValidators[fieldName];
            const fieldValue = obj[fieldName];
            if (isDefined(fieldValue)) {
                if (!validator(fieldValue)) {
                    errors.push({ field: fieldName, message: "Field is invalid" });
                }
            }
            else {
                const requiredIndex = requiredFields.indexOf(fieldName);
                if (requiredIndex >= 0) {
                    errors.push({ field: fieldName, message: "Field is required" });
                }
            }
        });
        return errors;
    }
    function isDefined(val) {
        return val !== null && val !== undefined;
    }
    Validation.isDefined = isDefined;
})(Validation || (Validation = {}));
module.exports = Validation;

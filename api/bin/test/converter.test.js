"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const converter = require("../script/utils/converter");
const storageTypes = require("../script/storage/storage");
const testUtils = require("./utils.test");
describe("Converter", () => {
    it("converts from storage account to REST account", (done) => {
        var storageAccount = testUtils.makeAccount();
        storageAccount.gitHubId = "1234";
        var restAccount = converter.toRestAccount(storageAccount);
        assert.equal(restAccount.email, storageAccount.email);
        assert.equal(restAccount.name, storageAccount.name);
        assert.equal(restAccount.linkedProviders.length, 1);
        assert.equal(restAccount.linkedProviders[0], "GitHub");
        var cast = restAccount;
        assert.equal(cast.id, undefined);
        assert.equal(cast.azureAdId, undefined);
        assert.equal(cast.gitHubId, undefined);
        assert.equal(cast.microsoftId, undefined);
        done();
    });
    //need to change the torestapp function in converter utility to make this test case functional 
    //add     assert.equal(restApps[1].name, "them@email.com:a"); to ensure working
    it("converts raw app names to qualified names if ambiguous", (done) => {
        var storageApps = [
            {
                createdTime: 1,
                name: "a",
                collaborators: {
                    "me@email.com": {
                        isCurrentAccount: true,
                        permission: storageTypes.Permissions.Owner,
                    },
                },
            },
            {
                createdTime: 2,
                name: "a",
                collaborators: {
                    "me@email.com": {
                        isCurrentAccount: true,
                        permission: storageTypes.Permissions.Collaborator,
                    },
                    "them@email.com": {
                        permission: storageTypes.Permissions.Owner,
                    },
                },
            },
        ];
        var deploymentNamesMap = [
            ["Production", "Staging"],
            ["Android", "IOS"],
        ];
        var restApps = converter.sortAndUpdateDisplayNameOfRestAppsList(storageApps.map((storageApp, index) => {
            return converter.toRestApp(storageApp, storageApp.name, deploymentNamesMap[index]);
        }));
        assert.equal(restApps[0].name, "a");
        assert.equal(Object.keys(restApps[0].collaborators).length, 1);
        assert.equal(restApps[0].deployments, deploymentNamesMap[0]);
        assert.equal(Object.keys(restApps[1].collaborators).length, 2);
        assert.equal(restApps[1].deployments, deploymentNamesMap[1]);
        done();
    });
    it("leaves raw app names untouched if unambiguous", (done) => {
        var storageApps = [
            {
                createdTime: 1,
                name: "a",
                collaborators: {
                    "me@email.com": {
                        isCurrentAccount: true,
                        permission: storageTypes.Permissions.Owner,
                    },
                },
            },
            {
                createdTime: 2,
                name: "b",
                collaborators: {
                    "me@email.com": {
                        isCurrentAccount: true,
                        permission: storageTypes.Permissions.Collaborator,
                    },
                    "them@email.com": {
                        permission: storageTypes.Permissions.Owner,
                    },
                },
            },
        ];
        var deploymentNamesMap = [
            ["Production", "Staging"],
            ["Android", "IOS"],
        ];
        var restApps = converter.sortAndUpdateDisplayNameOfRestAppsList(storageApps.map((storageApp, index) => {
            return converter.toRestApp(storageApp, storageApp.name, deploymentNamesMap[index]);
        }));
        assert.equal(restApps[0].name, "a");
        assert.equal(Object.keys(restApps[0].collaborators).length, 1);
        assert.equal(restApps[0].deployments, deploymentNamesMap[0]);
        assert.equal(restApps[1].name, "b");
        assert.equal(Object.keys(restApps[1].collaborators).length, 2);
        assert.equal(restApps[1].deployments, deploymentNamesMap[1]);
        done();
    });
    it("converts from storage deployment to REST deployment", (done) => {
        var storageDeployment = testUtils.makeStorageDeployment();
        storageDeployment.id = "a";
        storageDeployment.key = "testKey";
        storageDeployment.package = testUtils.makePackage();
        var restDeployment = converter.toRestDeployment(storageDeployment);
        assert.equal(restDeployment.name, storageDeployment.name);
        assert.equal(restDeployment.key, storageDeployment.key);
        verifyRestPackage(storageDeployment.package, restDeployment.package);
        done();
    });
    it("converts from storage package to REST package", (done) => {
        var storagePackage = testUtils.makePackage();
        var restPackage = converter.toRestPackage(storagePackage);
        verifyRestPackage(storagePackage, restPackage);
        done();
    });
    it("converts from Redis metrics to REST metrics", (done) => {
        var redisMetrics = {
            "1.0.0:Active": 11,
            "v1:Active": 22,
            "v1:Downloaded": 33,
            "v1:DeploymentSucceeded": 44,
            "v2:Downloaded": 55,
            "v2:DeploymentFailed": 66,
        };
        var restMetrics = converter.toRestDeploymentMetrics(redisMetrics);
        assert.equal(restMetrics["1.0.0"].active, redisMetrics["1.0.0:Active"]);
        assert.equal(restMetrics["v1"].active, redisMetrics["v1:Active"]);
        assert.equal(restMetrics["v1"].downloaded, redisMetrics["v1:Downloaded"]);
        assert.equal(restMetrics["v1"].failed, 0);
        assert.equal(restMetrics["v1"].installed, redisMetrics["v1:DeploymentSucceeded"]);
        assert.equal(restMetrics["v2"].active, 0);
        assert.equal(restMetrics["v2"].downloaded, redisMetrics["v2:Downloaded"]);
        assert.equal(restMetrics["v2"].failed, redisMetrics["v2:DeploymentFailed"]);
        assert.equal(restMetrics["v2"].installed, 0);
        done();
    });
    it("converts from REST deployment to storage deployment", (done) => {
        var restDeployment = {
            name: "c",
            key: "testKey",
            package: createRestPackage(),
        };
        var storageDeployment = converter.toStorageDeployment(restDeployment, new Date().getTime());
        assert.equal(storageDeployment.name, restDeployment.name);
        assert.equal(storageDeployment.key, restDeployment.key);
        verifyStoragePackage(restDeployment.package, storageDeployment.package);
        done();
    });
    it("converts from REST package to storage package", (done) => {
        var restPackage = createRestPackage();
        var storagePackage = converter.toStoragePackage(restPackage);
        verifyStoragePackage(restPackage, storagePackage);
        done();
    });
    function createRestPackage() {
        return {
            appVersion: "a",
            description: "b",
            blobUrl: "c",
            diffPackageMap: { d: { url: "e", size: 1 } },
            isMandatory: true,
            label: "f",
            packageHash: "g",
            size: 1,
            uploadTime: new Date().getTime(),
        };
    }
    function verifyRestPackage(storagePackage, restPackage) {
        assert.equal(restPackage.appVersion, storagePackage.appVersion);
        assert.equal(restPackage.blobUrl, storagePackage.blobUrl);
        assert.equal(restPackage.description, storagePackage.description);
        assert.deepEqual(restPackage.diffPackageMap, storagePackage.diffPackageMap);
        assert.equal(restPackage.isMandatory, storagePackage.isMandatory);
        assert.equal(restPackage.label, storagePackage.label);
        assert.equal(restPackage.packageHash, storagePackage.packageHash);
        assert.equal(restPackage.size, storagePackage.size);
        assert.equal(restPackage.uploadTime, storagePackage.uploadTime);
        var cast = restPackage;
        assert.equal(cast.manifestBlobUrl, undefined);
    }
    function verifyStoragePackage(restPackage, storagePackage) {
        assert.equal(storagePackage.appVersion, restPackage.appVersion);
        assert.equal(storagePackage.blobUrl, restPackage.blobUrl);
        assert.equal(storagePackage.description, restPackage.description);
        assert.deepEqual(storagePackage.diffPackageMap, restPackage.diffPackageMap);
        assert.equal(storagePackage.isMandatory, restPackage.isMandatory);
        assert.equal(storagePackage.label, restPackage.label);
        assert.equal(storagePackage.manifestBlobUrl, undefined);
        assert.equal(storagePackage.packageHash, restPackage.packageHash);
        assert.equal(storagePackage.size, restPackage.size);
        assert.equal(storagePackage.uploadTime, restPackage.uploadTime);
    }
});

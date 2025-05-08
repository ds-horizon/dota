"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
// Path for JsonStorage file
const storagePath = process.env.LOCAL_STORAGE_PATH || path.join(__dirname, 'JsonStorage.json');
// Define NIL_UUID for consistent usage
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
// Define the structure that matches the expected data format
const jsonStorageData = {
    "deploymentKeyMap": {
        "O25dwjupnmTCC-q70qC1CzWfO73NkSR75brivk": {
            "appId": "id_2",
            "deploymentId": "id_5",
            "deployment": "Deployment One"
        },
        "deployment_key_2": {
            "appId": "id_3",
            "deploymentId": "id_6",
            "deployment": "Deployment for App Two"
        }
    },
    "clientUniqueIdMap": {
        "095be37c-5f9a-4be6-b0f4-ffa632412923": {}
    },
    "accounts": {
        "id_0": {
            "email": "user1@example.com",
            "name": "User One",
            "createdTime": Date.now()
        },
        "id_1": {
            "email": "user2@example.com",
            "name": "User Two",
            "createdTime": Date.now()
        }
    },
    "tenants": {
        "tenant_1": {
            "displayName": "Organization One",
            "createdBy": "id_0"
        },
        "tenant_2": {
            "displayName": "Organization Two",
            "createdBy": "id_1"
        }
    },
    "apps": {
        "id_2": {
            "name": "App One",
            "accountId": "id_0",
            "tenantId": "tenant_1",
            "createdTime": Date.now(),
            "collaborators": {
                "user1@example.com": {
                    "permission": "Owner",
                    "role": "Admin"
                }
            },
            "deployments": {
                "Deployment One": {
                    "id": "id_5",
                    "key": "O25dwjupnmTCC-q70qC1CzWfO73NkSR75brivk",
                    "name": "Deployment One",
                    "package": "pkg_1",
                    "latestPackage": "pkg_1",
                    "createdTime": 1731269070
                }
            }
        },
        "id_3": {
            "name": "App Two",
            "accountId": "id_1",
            "tenantId": "tenant_2",
            "createdTime": Date.now(),
            "collaborators": {
                "user2@example.com": {
                    "permission": "Owner",
                    "role": "Admin"
                }
            },
            "deployments": {
                "Deployment for App Two": {
                    "id": "id_6",
                    "key": "deployment_key_2",
                    "name": "Deployment for App Two",
                    "package": "pkg_current_2",
                    "latestPackage": "pkg_current_2",
                    "createdTime": 1731269070
                }
            }
        },
        "id_4": {
            "name": "Independent App",
            "accountId": "id_0",
            "createdTime": Date.now(),
            "collaborators": {
                "user1@example.com": {
                    "permission": "Owner",
                    "role": "Admin"
                }
            }
        }
    },
    "deployments": {
        "id_5": {
            "name": "Deployment One",
            "key": "O25dwjupnmTCC-q70qC1CzWfO73NkSR75brivk",
            "appId": "id_2",
            "packageId": "pkg_1",
            "createdTime": 1731269070
        },
        "id_6": {
            "name": "Deployment for App Two",
            "key": "deployment_key_2",
            "appId": "id_3",
            "packageId": "pkg_current_2",
            "createdTime": 1731269070
        }
    },
    "packages": {
        "pkg_1": {
            "packageHash": "d581c94fa2c00b144f1b9a5cf786787826bdf4a9e12e4941c8d2541efc7518ed",
            "blobUrl": "https://codepush-secondary.blob.core.windows.net/storagev2/z98_ktyhgijjKQai7fIvDj6z_t6pb984637d-14f4-409d-9646-13a0665a3902",
            "manifestBlobUrl": "https://codepush-secondary.blob.core.windows.net/storagev2",
            "description": "Minor improvements",
            "isDisabled": false,
            "isMandatory": false,
            "appVersion": "1.0.0",
            "rollout": 100,
            "size": 256994,
            "releaseMethod": "Upload",
            "uploadTime": 1731269070,
            "label": "v1",
            "releasedBy": "user1@example.com",
            "diffPackageMap": {},
            "deploymentId": "id_5"
        },
        "pkg_current_2": {
            "packageHash": "hash_2",
            "blobUrl": "https://example.com/blob_v2",
            "manifestBlobUrl": "https://example.com/manifest_v2",
            "description": "Current version of App Two",
            "isDisabled": false,
            "isMandatory": false,
            "appVersion": "1.2.0",
            "rollout": 100,
            "size": 2048,
            "releaseMethod": "Upload",
            "uploadTime": Date.now(),
            "label": "v2",
            "releasedBy": "user2@example.com",
            "diffPackageMap": {},
            "deploymentId": "id_6"
        },
        "pkg_hist_1": {
            "packageHash": "hash_old_1",
            "blobUrl": "https://example.com/blob_v0.9",
            "manifestBlobUrl": "https://example.com/manifest_v0.9",
            "description": "Previous version of App One",
            "isDisabled": false,
            "isMandatory": false,
            "appVersion": "1.2.3",
            "rollout": 100,
            "size": 900,
            "releaseMethod": "Upload",
            "uploadTime": Date.now() - 1000000,
            "label": "v3",
            "releasedBy": "user1@example.com",
            "diffPackageMap": {},
            "deploymentId": "id_5"
        }
    },
    "accessKeys": {
        "id_6": {
            "name": "accessKey1",
            "accountId": "id_0",
            "createdBy": "admin",
            "createdTime": Date.now(),
            "friendlyName": "Default Access Key",
            "expires": Date.now() + (365 * 24 * 60 * 60 * 1000),
            "scope": "all"
        },
        "mock_token_key": {
            "name": "mock-google-token",
            "accountId": "id_0",
            "createdBy": "admin",
            "createdTime": Date.now(),
            "friendlyName": "Mock Google Token for Development",
            "expires": Date.now() + (365 * 24 * 60 * 60 * 1000),
            "scope": "all"
        }
    },
    "packageHistory": {
        "id_5": [
            {
                "appVersion": "1.0.0",
                "label": "v1",
                "packageHash": "d581c94fa2c00b144f1b9a5cf786787826bdf4a9e12e4941c8d2541efc7518ed",
                "rollout": 100,
                "isMandatory": false,
                "blobUrl": "https://codepush-secondary.blob.core.windows.net/storagev2/z98_ktyhgijjKQai7fIvDj6z_t6pb984637d-14f4-409d-9646-13a0665a3902",
                "manifestBlobUrl": "https://codepush-secondary.blob.core.windows.net/storagev2",
                "size": 256994,
                "description": "Minor improvements",
                "releasedBy": "user1@example.com",
                "releaseMethod": "Upload",
                "uploadTime": 1731269070
            },
            {
                "appVersion": "1.2.3",
                "label": "v3",
                "packageHash": "hash_old_1",
                "rollout": 100,
                "isMandatory": false,
                "blobUrl": "https://example.com/blob_v0.9",
                "manifestBlobUrl": "https://example.com/manifest_v0.9",
                "size": 900,
                "description": "Previous version of App One",
                "releasedBy": "user1@example.com",
                "releaseMethod": "Upload",
                "uploadTime": Date.now() - 1000000
            }
        ],
        "id_6": [
            {
                "appVersion": "1.2.0",
                "label": "v2",
                "packageHash": "hash_2",
                "rollout": 100,
                "isMandatory": false,
                "blobUrl": "https://example.com/blob_v2",
                "manifestBlobUrl": "https://example.com/manifest_v2",
                "size": 2048,
                "description": "Current version of App Two",
                "releasedBy": "user2@example.com",
                "releaseMethod": "Upload",
                "uploadTime": Date.now()
            }
        ]
    },
    "accessKeyNameToAccountIdMap": {
        "accessKey1": {
            "accountId": "id_0",
            "expires": Date.now() + (365 * 24 * 60 * 60 * 1000)
        },
        "mock-google-token": {
            "accountId": "id_0",
            "expires": Date.now() + (365 * 24 * 60 * 60 * 1000)
        }
    }
};
// Function to seed JsonStorage
async function seedJsonStorage() {
    try {
        console.log(`Seeding data to JsonStorage at ${storagePath}`);
        // Write data to JsonStorage file
        fs.writeFileSync(storagePath, JSON.stringify(jsonStorageData, null, 2));
        console.log('JsonStorage has been successfully seeded with data.');
    }
    catch (error) {
        console.error('Error seeding JsonStorage:', error);
    }
}
// Run the seed function
seedJsonStorage();

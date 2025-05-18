# DOTA API Reference

This document provides an overview of the DOTA backend API endpoints, including management, acquisition, and authentication routes.

---

## Authentication

Most endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessKey>
```

---

## Account

### `GET /account`
Get current user's account.

**Response:**
```json
{
  "account": { ...Account }
}
```

### `POST /account`
Create a new account.

**Body:**
```json
{
  "account": { ...Account }
}
```
**Response:**
```json
{
  "account": "<accountId>"
}
```

---

## Access Keys

### `GET /accessKeys`
List all access keys for the user.

**Response:**
```json
{
  "accessKeys": [ ...AccessKey ]
}
```

### `POST /accessKeys`
Create a new access key.

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "ttl": 1234
}
```
**Response:**
```json
{
  "accessKey": { ...AccessKey }
}
```

---

## Apps

### `GET /apps`
List all apps for the user.

**Response:**
```json
{
  "apps": [ ...App ]
}
```

### `POST /apps`
Create a new app.

**Body:**
```json
{
  "name": "string",
  "displayName": "string",
  "manuallyProvisionDeployments": true
}
```
**Response:**
```json
{
  "app": { ...App }
}
```

### `GET /apps/{appName}`
Get details for a specific app.

### `PATCH /apps/{appName}`
Update app metadata.

### `DELETE /apps/{appName}`
Delete an app.

---

## Collaborators

### `GET /apps/{appName}/collaborators`
List collaborators for an app.

### `POST /apps/{appName}/collaborators/{email}`
Add a collaborator.

### `PATCH /apps/{appName}/collaborators/{email}`
Update collaborator role.

### `DELETE /apps/{appName}/collaborators/{email}`
Remove a collaborator.

---

## Deployments

### `GET /apps/{appName}/deployments`
List deployments for an app.

### `POST /apps/{appName}/deployments`
Create a deployment.

### `GET /apps/{appName}/deployments/{deploymentName}`
Get deployment details.

### `PATCH /apps/{appName}/deployments/{deploymentName}`
Update deployment metadata.

### `DELETE /apps/{appName}/deployments/{deploymentName}`
Delete a deployment.

---

## Releases

### `POST /apps/{appName}/deployments/{deploymentName}/release`
Release a new update.

### `PATCH /apps/{appName}/deployments/{deploymentName}/release`
Patch latest release metadata.

### `GET /apps/{appName}/deployments/{deploymentName}/history`
Get release history.

### `DELETE /apps/{appName}/deployments/{deploymentName}/history`
Clear release history.

---

## Metrics

### `GET /apps/{appName}/deployments/{deploymentName}/metrics`
Get deployment metrics.

---

## Organizations / Tenants

### `GET /tenants`
List organizations/tenants for the user.

---

## Acquisition Endpoints

### `GET /updateCheck`
Check for update.

**Query Parameters:**
- `deploymentKey` (string, required)
- `appVersion` (string, required)
- `packageHash` (string, optional)
- `isCompanion` (boolean, optional)
- `label` (string, optional)
- `clientUniqueId` (string, optional)

**Response:**
```json
{
  "updateInfo": {
    "downloadURL": "string",
    "description": "string",
    "isAvailable": true,
    "isMandatory": false,
    "appVersion": "string",
    "label": "string",
    "packageHash": "string",
    "target_binary_range": "string"
  }
}
```

### `GET /v0.1/public/codepush/update_check`
Same as `/updateCheck`, but with snake_case keys.

---

### `POST /reportStatus/deploy`
Report deploy status.

**Body:**
```json
{
  "deploymentKey": "string",
  "appVersion": "string",
  "label": "string",
  "status": "string",
  "clientUniqueId": "string",
  "previousDeploymentKey": "string",
  "previousLabelOrAppVersion": "string"
}
```

### `POST /v0.1/public/codepush/report_status/deploy`
Same as above, but with snake_case keys.

---

### `POST /reportStatus/download`
Report download status.

**Body:**
```json
{
  "deploymentKey": "string",
  "label": "string"
}
```

### `POST /v0.1/public/codepush/report_status/download`
Same as above, but with snake_case keys.

---

## Health

### `GET /healthcheck`
Returns `Healthy` if the server and dependencies are up.

---

## Schemas

- **Account**: `{ id, name, email, createdTime }`
- **AccessKey**: `{ id, name, friendlyName, description, createdBy, createdTime, expires, scope }`
- **App**: `{ id, name, displayName, createdTime, tenantId }`
- **Deployment**: `{ id, name, key, createdTime, package }`
- **Package**: `{ label, appVersion, description, uploadTime, blobUrl, size, isMandatory, isDisabled }`
- **Collaborator**: `{ email, accountId, permission }`
- **Organization**: `{ id, displayName, role }`
- **Metrics**: `{ active, downloaded, failed, installed, totalActive }`
- **UpdateCheckResponse**: `{ downloadURL, description, isAvailable, isMandatory, appVersion, label, packageHash, target_binary_range }`

---

**For full details and try-it-out, see your `API Guide(https://dota.dreamsportslabs.com/documentation/api)` Swagger UI.** 
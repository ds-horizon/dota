-- Seed data for CodePush database

-- Insert Accounts
INSERT INTO Accounts (id, email, name, createdTime) VALUES
('id_0', 'user1@example.com', 'User One', UNIX_TIMESTAMP() * 1000),
('id_1', 'user2@example.com', 'User Two', UNIX_TIMESTAMP() * 1000);

-- Insert Tenants
INSERT INTO Tenants (id, displayName, createdBy) VALUES
('tenant_1', 'Organization One', 'id_0'),
('tenant_2', 'Organization Two', 'id_1');

-- Insert Apps
INSERT INTO Apps (id, name, accountId, tenantId, createdTime) VALUES
('id_2', 'App One', 'id_0', 'tenant_1', UNIX_TIMESTAMP() * 1000),
('id_3', 'App Two', 'id_1', 'tenant_2', UNIX_TIMESTAMP() * 1000),
('id_4', 'Independent App', 'id_0', NULL, UNIX_TIMESTAMP() * 1000);

-- Insert Collaborators
INSERT INTO Collaborators (email, accountId, appId, permission, role) VALUES
('user1@example.com', 'id_0', 'id_2', 'Owner', 'Admin'),
('user2@example.com', 'id_1', 'id_3', 'Owner', 'Admin');

-- Insert Deployments
INSERT INTO Deployments (id, name, `key`, appId, packageId, createdTime) VALUES
('id_5', 'Deployment One', 'O25dwjupnmTCC-q70qC1CzWfO73NkSR75brivk', 'id_2', 'pkg_1', 1731269070),
('id_6', 'Deployment for App Two', 'deployment_key_2', 'id_3', 'pkg_current_2', 1731269070);

-- Insert Packages
INSERT INTO Packages (id, appVersion, blobUrl, description, isDisabled, isMandatory, label, manifestBlobUrl, packageHash, releasedBy, releaseMethod, size, uploadTime, deploymentId, rollout) VALUES
('pkg_1', '1.0.0', 'https://codepush-secondary.blob.core.windows.net/storagev2/z98_ktyhgijjKQai7fIvDj6z_t6pb984637d-14f4-409d-9646-13a0665a3902', 'Minor improvements', false, false, 'v1', 'https://codepush-secondary.blob.core.windows.net/storagev2', 'd581c94fa2c00b144f1b9a5cf786787826bdf4a9e12e4941c8d2541efc7518ed', 'user1@example.com', 'Upload', 256994, 1731269070, 'id_5', 100),
('pkg_current_1', '1.0.0', 'https://example.com/blob_v1', 'Current version of App One', false, true, 'v2', 'https://example.com/manifest_v1', 'hash_1', 'user1@example.com', 'Upload', 1024, UNIX_TIMESTAMP() * 1000, 'id_5', 100),
('pkg_current_2', '1.2.0', 'https://example.com/blob_v2', 'Current version of App Two', false, false, 'v2', 'https://example.com/manifest_v2', 'hash_2', 'user2@example.com', 'Upload', 2048, UNIX_TIMESTAMP() * 1000, 'id_6', 100),
('pkg_hist_1', '1.2.3', 'https://example.com/blob_v0.9', 'Previous version of App One', false, false, 'v3', 'https://example.com/manifest_v0.9', 'hash_old_1', 'user1@example.com', 'Upload', 900, UNIX_TIMESTAMP() * 1000 - 1000000, 'id_5', 100);

-- Insert Access Keys
INSERT INTO AccessKeys (id, name, accountId, createdBy, createdTime, friendlyName, expires, scope) VALUES
('id_6', 'accessKey1', 'id_0', 'admin', UNIX_TIMESTAMP() * 1000, 'Default Access Key', 1735689600000, 'all'),
('mock_token_key', 'mock-google-token', 'id_0', 'admin', UNIX_TIMESTAMP() * 1000, 'Mock Google Token for Development', UNIX_TIMESTAMP() * 1000 + (365 * 24 * 60 * 60 * 1000), 'all'); 
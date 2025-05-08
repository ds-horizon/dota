export type Organization = {
  id: string;
  displayName: string;
  role: "Owner" | "Collaborator";
};

type Collaborator = {
  isCurrentAccount: boolean;
  permission: Organization["role"];
};

type Apps = {
  name: string;
  collaborators: Record<string, Collaborator>;
  deployments: string[];
};

type Deployment = {
  id: string;
  name: string;
  key: string;
  packageId: null | string;
  appId: string;
  createdTime: string;
  createdAt: string;
  updatedAt: string;
};

type Package = {
  appVersion: string;
  blobUrl: string;
  description: string;
  isDisabled: boolean;
  isMandatory: boolean;
  label: string;
  originalDeployment: string | null;
  originalLabel: string | null;
  packageHash: string;
  releasedBy: string;
  releaseMethod: string;
  rollout: number;
  size: number;
  uploadTime: number;
  active: number | null;
  downloaded: number | null;
  failed: number | null;
  installed: number | null;
  totalActive: number | null;
};

export type UpdatePackageRequest = {
  appVersion: string;
  description: string;
  isDisabled: boolean;
  isMandatory: boolean;
  rollout: number;
  label: string;
};

type AccessKey = {
  createdTime: number;
  expires: number;
  description: null;
  friendlyName: string;
  name: string;
  id: string;
  scope: CreateAccessKeyRequest["access"];
};

export type BaseHeader = {
  userId: string;
};

export type TenantsResponse = {
  organisations: Organization[];
};

export type TenantsRequest = BaseHeader;

export type AppsRequest = BaseHeader & {
  tenant: string;
};

export type DeleteTenantResponse = {
  status: string;
};

export type AppsResponse = {
  apps: Apps[];
};

export type CreateAppRequest =
  | (BaseHeader & {
      name: string;
      orgId: string;
      orgName?: never;
    })
  | (BaseHeader & {
      name: string;
      orgName: string;
      orgId?: never;
    });

export type CreateAppResponse = {
  app: Apps;
};

export type DeploymentsRequest = BaseHeader & {
  appId: string;
};

export type DeploymentsResponse = {
  deployments: Deployment[];
};

export type DeleteDeploymentsRequest = BaseHeader & {
  appId: string;
  tenant: string;
  deploymentName: string;
};

export type DeleteDeploymentsResponse = {
  deployment: Deployment;
};

export type CreateDeploymentsRequest = BaseHeader & {
  appId: string;
  name: string;
};

export type CreateDeploymentsResponse = {
  deployments: Deployment;
};

export type DeploymentsReleaseRequest = BaseHeader & {
  appId: string;
  deploymentName: string;
};

export type DeploymentsReleaseResponse = {
  deployment: {
    name: string;
    key: string;
    package: Package;
    packageHistory: Package[];
  };
};

export type UpdateDeploymentsReleaseRequest = BaseHeader & {
  appId: string;
  deploymentName: string;
  tenant: string;
} & UpdatePackageRequest;

export type UpdateDeploymentsReleaseResponse = {
  deployment: {
    name: string;
    key: string;
    package: Package;
    packageHistory: Package[];
  };
};

export type AccessKeyRequest = BaseHeader;

export type AccessKeyResponse = {
  accessKeys: AccessKey[];
};

export type CreateAccessKeyRequest = BaseHeader & {
  name: string;
  access: "All" | "Write" | "Read";
};

export type DeleteAccessKeyRequest = BaseHeader & {
  name: string;
};

export type DeleteAccessKeyResponse = {
  name: string;
};

export type CreateAccessKeyResponse = {
  accessKey: {
    friendlyName: string;
    description: string;
    name: string;
    createdBy: string;
    createdTime: number;
    expires: number;
  };
};

export type CollabaratorsRequest = BaseHeader & {
  tenant: string;
  appId: string;
};

export type CollabaratorsResponse = {
  collaborators: Record<string, Collaborator>;
};

export type DeleteAppRequest = BaseHeader & {
  tenant: string;
  appId: string;
};

export type DeleteAppResponse = {
  status: string;
};

export type AddCollabaratorsRequest = BaseHeader & {
  tenant: string;
  appId: string;
  email: string;
};

export type AddCollabaratorsResponse = {
  collaborators: Record<string, Collaborator>;
};

export type RemoveCollabaratorsRequest = BaseHeader & {
  tenant: string;
  appId: string;
  email: string;
};

export type RemoveCollabaratorsResponse = {
  collaborators: Record<string, Collaborator>;
};

export type UpdateCollabaratorsRequest = BaseHeader & {
  tenant: string;
  appId: string;
  email: string;
  role: Organization["role"];
};

export type UpdateCollabaratorsResponse = {
  collaborators: Record<string, Collaborator>;
};

export type PromoteReleaseToDeploymentRequest = BaseHeader & {
  sourceDeployment: string;
  targetDeployment: string;
  appVersion: string;
  label: string;
  appId: string;
  description: string;
  isDisabled: boolean;
  isMandatory: boolean;
  tenant: string;
};

export type PromoteReleaseToDeploymentResponse = {
  package: Package;
};

import axios, { AxiosResponse } from "axios";
import { env } from "../config";
import { User } from "../Auth/Auth.interface";
import {
  AccessKeyRequest,
  AccessKeyResponse,
  AddCollabaratorsRequest,
  AddCollabaratorsResponse,
  AppsRequest,
  AppsResponse,
  BaseHeader,
  CollabaratorsRequest,
  CollabaratorsResponse,
  CreateAccessKeyRequest,
  CreateAccessKeyResponse,
  CreateAppRequest,
  CreateAppResponse,
  CreateDeploymentsRequest,
  CreateDeploymentsResponse,
  DeleteAccessKeyRequest,
  DeleteAccessKeyResponse,
  DeleteAppRequest,
  DeleteAppResponse,
  DeleteDeploymentsRequest,
  DeleteDeploymentsResponse,
  DeleteTenantResponse,
  DeploymentsReleaseRequest,
  DeploymentsReleaseResponse,
  DeploymentsRequest,
  DeploymentsResponse,
  PromoteReleaseToDeploymentRequest,
  PromoteReleaseToDeploymentResponse,
  RemoveCollabaratorsRequest,
  RemoveCollabaratorsResponse,
  TenantsRequest,
  TenantsResponse,
  UpdateCollabaratorsRequest,
  UpdateCollabaratorsResponse,
  UpdateDeploymentsReleaseRequest,
  UpdatePackageRequest,
} from "./types";

class Codepush {
  private __client = axios.create({
    baseURL: env.CODEPUSH_SERVER_URL,
    timeout: 10000,
  });

  async getUser(token: string): Promise<User> {
    if (!env.CODEPUSH_SERVER_URL.length) {
      return Promise.resolve({
        authenticated: true,
        user: {
          createdTime: Date.now(),
          name: "Dummy User",
          email: "dummy_user@gmail.com",
          id: "id_1",
          createdAt: "2024-10-30T08:41:07.000Z",
          updatedAt: "2024-10-30T08:41:07.000Z",
        },
      });
    }

    const { data } = await this.__client.get<
      null,
      { status: number; data: User }
    >("/authenticated", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  getUserByAccessKey(key: string) {
    return this.__client.get<null, AxiosResponse<Omit<User, "authenticated">>>(
      "/accountByaccessKeyName",
      {
        headers: {
          accessKeyName: key,
        },
      }
    );
  }

  async getTenants(userId: string) {
    const headers: TenantsRequest = {
      userId,
    };

    return this.__client.get<null, AxiosResponse<TenantsResponse>>("/tenants", {
      headers,
    });
  }

  async getAppsForTenants(data: AppsRequest) {
    const headers: AppsRequest = data;

    return this.__client.get<null, AxiosResponse<AppsResponse>>("/apps", {
      headers,
    });
  }

  async createAppForTenant(data: CreateAppRequest) {
    const headers: CreateAppRequest = data;

    const payload = data.orgId?.length
      ? {
          orgId: data.orgId,
        }
      : {
          orgName: data.orgName,
        };

    return this.__client.post<null, AxiosResponse<CreateAppResponse>>(
      "/apps",
      {
        name: data.name,
        organisation: payload,
      },
      {
        headers,
      }
    );
  }

  async deleteTenant(data: AppsRequest) {
    const headers: Omit<AppsRequest, "userId"> = data;

    return this.__client.delete<null, AxiosResponse<DeleteTenantResponse>>(
      `/tenants/${encodeURIComponent(data.tenant)}`,
      {
        headers,
      }
    );
  }

  async getDeployentsForApp(data: DeploymentsRequest) {
    const headers: DeploymentsRequest = data;

    return this.__client.get<null, AxiosResponse<DeploymentsResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/deployments`,
      {
        headers,
      }
    );
  }

  async deleteDeployentsForApp(data: DeleteDeploymentsRequest) {
    const headers: DeleteDeploymentsRequest = data;

    return this.__client.delete<null, AxiosResponse<DeleteDeploymentsResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/deployments/${encodeURIComponent(
        data.deploymentName
      )}`,
      {
        headers,
      }
    );
  }

  async getCollaboratorForApp(data: CollabaratorsRequest) {
    const headers: CollabaratorsRequest = data;

    return this.__client.get<null, AxiosResponse<CollabaratorsResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/collaborators`,
      {
        headers,
      }
    );
  }

  async deleteAppForTenant(data: DeleteAppRequest) {
    const headers: Omit<DeleteAppRequest, "appId"> = data;

    return this.__client.delete<null, AxiosResponse<DeleteAppResponse>>(
      `/apps/${encodeURIComponent(data.appId)}`,
      {
        headers,
      }
    );
  }

  async addCollaboratorForApp(data: AddCollabaratorsRequest) {
    const headers: AddCollabaratorsRequest = data;

    return this.__client.post<null, AxiosResponse<AddCollabaratorsResponse>>(
      `/apps/${encodeURIComponent(
        data.appId
      )}/collaborators/${encodeURIComponent(data.email)}`,
      {},
      {
        headers,
      }
    );
  }

  async removeCollaboratorForApp(data: RemoveCollabaratorsRequest) {
    const headers: RemoveCollabaratorsRequest = data;

    return this.__client.delete<
      null,
      AxiosResponse<RemoveCollabaratorsResponse>
    >(
      `/apps/${encodeURIComponent(
        data.appId
      )}/collaborators/${encodeURIComponent(data.email)}`,
      {
        headers,
      }
    );
  }

  async updateCollaboratorPermissionForApp(data: UpdateCollabaratorsRequest) {
    const headers: UpdateCollabaratorsRequest = data;

    return this.__client.patch<
      null,
      AxiosResponse<UpdateCollabaratorsResponse>
    >(
      `/apps/${encodeURIComponent(
        data.appId
      )}/collaborators/${encodeURIComponent(data.email)}`,
      {
        role: data.role,
      },
      {
        headers,
      }
    );
  }

  async createDeployentsForApp(data: CreateDeploymentsRequest) {
    const headers: BaseHeader = data;

    return this.__client.post<null, AxiosResponse<CreateDeploymentsResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/deployments`,
      {
        name: data.name,
      },
      {
        headers,
      }
    );
  }

  async getReleasesForDeployentsForApp(data: DeploymentsReleaseRequest) {
    const headers: DeploymentsReleaseRequest = data;

    return this.__client.get<null, AxiosResponse<DeploymentsReleaseResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/deployments/${encodeURIComponent(
        data.deploymentName
      )}`,
      {
        headers,
      }
    );
  }

  async updateReleaseForDeployentForApp(data: UpdateDeploymentsReleaseRequest) {
    const headers: Pick<UpdateDeploymentsReleaseRequest, "tenant" | "userId"> =
      data;
    const body: UpdatePackageRequest = { ...data };

    return this.__client.patch<null, AxiosResponse<DeploymentsReleaseResponse>>(
      `/apps/${encodeURIComponent(data.appId)}/deployments/${encodeURIComponent(
        data.deploymentName
      )}/release`,
      {
        packageInfo: body,
      },
      {
        headers,
      }
    );
  }

  async getAccessKeys(data: AccessKeyRequest) {
    const headers: AccessKeyRequest = data;

    return this.__client.get<null, AxiosResponse<AccessKeyResponse>>(
      `/accessKeys`,
      {
        headers,
      }
    );
  }

  async createAccessKey(data: CreateAccessKeyRequest) {
    const headers: AccessKeyRequest = data;

    return this.__client.post<null, AxiosResponse<CreateAccessKeyResponse>>(
      `/accessKeys`,
      {
        friendlyName: data.name,
        scope: data.access,
      },
      {
        headers,
      }
    );
  }

  async deleteAccessKey(data: DeleteAccessKeyRequest) {
    const headers: BaseHeader = data;

    return this.__client.delete<null, AxiosResponse<DeleteAccessKeyResponse>>(
      `/accessKeys/${encodeURIComponent(data.name)}`,
      {
        headers,
      }
    );
  }

  async promoteReleaseFromDeployment(data: PromoteReleaseToDeploymentRequest) {
    const headers: Pick<
      PromoteReleaseToDeploymentRequest,
      "userId" | "tenant"
    > = data;

    return this.__client.post<
      null,
      AxiosResponse<PromoteReleaseToDeploymentResponse>
    >(
      `apps/${encodeURIComponent(data.appId)}/deployments/${encodeURIComponent(
        data.sourceDeployment
      )}/promote/${encodeURIComponent(data.targetDeployment)}`,
      {
        packageInfo: {
          appVersion: data.appVersion,
          label: data.label,
          rollout: 1,
          description: data.description,
          isDisabled: data.isDisabled,
          isMandatory: data.isMandatory,
        },
      },
      {
        headers,
      }
    );
  }
}

export const CodepushService = new Codepush();

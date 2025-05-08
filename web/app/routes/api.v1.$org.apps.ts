import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import { CreateAppRequest } from "~/.server/services/Codepush/types";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

const createDeployment: AuthenticatedActionFunction = async ({
  user,
  request,
}) => {
  const body = await request.json();

  const payload: CreateAppRequest = body.orgId?.length
    ? {
        userId: user.user.id,
        orgId: (body.orgId as string) ?? "",
        name: (body.name as string) ?? "",
      }
    : {
        userId: user.user.id,
        orgName: (body.orgName as string) ?? "",
        name: (body.name as string) ?? "",
      };

  const { data, status } = await CodepushService.createAppForTenant(payload);
  return json(data, { status });
};

export const loader = authenticateLoaderRequest(async ({ user, params }) => {
  const { data, status } = await CodepushService.getAppsForTenants({
    userId: user.user.id,
    tenant: params.org ?? "",
  });
  return json(data, { status });
});

export const action = authenticateActionRequest({ POST: createDeployment });

import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

// Resolve tenant header which may be either a tenant displayName (e.g. "organization-one")
// or a tenant id (e.g. "tenant_1"). Always convert to tenant id for backend API calls.
async function resolveTenantId(possibleTenant: string, userId: string): Promise<string> {
  if (!possibleTenant) return "";
  try {
    const { data } = await CodepushService.getTenants(userId);
    const matched = data.organisations.find(
      (org) => org.id === possibleTenant || org.displayName === possibleTenant
    );
    return matched ? matched.id : possibleTenant;
  } catch {
    return possibleTenant;
  }
}

const addCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const body = await request.json();
  const tenant = await resolveTenantId(body.tenant ?? "", user.user.id);
  const { data, status } = await CodepushService.addCollaboratorForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    email: body.email ?? "",
    tenant,
  });
  return json(data, { status });
};

const removeCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const tenantHeader = request.headers.get("tenant") ?? "";
  const tenant = await resolveTenantId(tenantHeader, user.user.id);
  const { data, status } = await CodepushService.removeCollaboratorForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    email: request.headers.get("email") ?? "",
    tenant,
  });
  return json(data, { status });
};

const updateCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const body = await request.json();
  const tenant = await resolveTenantId(body.tenant ?? "", user.user.id);
  const { data, status } =
    await CodepushService.updateCollaboratorPermissionForApp({
      userId: user.user.id,
      appId: params.app ?? "",
      email: body.email ?? "",
      tenant,
      role: body.role ?? "Collaborator",
    });
  return json(data, { status });
};

export const loader = authenticateLoaderRequest(
  async ({ user, params, request }) => {
    const tenantHeader = request.headers.get("tenant") ?? "";
    const tenant = await resolveTenantId(tenantHeader, user.user.id);
    const { data, status } = await CodepushService.getCollaboratorForApp({
      userId: user.user.id,
      appId: params.app ?? "",
      tenant,
    });
    return json(data, { status });
  }
);

export const action = authenticateActionRequest({
  POST: addCollabarator,
  PATCH: updateCollabarator,
  DELETE: removeCollabarator,
});
declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/api/v1/:app/collaborators": { "app": string };
    "/api/v1/:app/deployments": { "app": string };
    "/api/v1/:app/deployments/:deploymentName": { "app": string, "deploymentName": string };
    "/api/v1/:app/deployments/:deploymentName/promote/:targetDeployment": { "app": string, "deploymentName": string, "targetDeployment": string };
    "/api/v1/:app/deployments/:deploymentName/releases": { "app": string, "deploymentName": string };
    "/api/v1/:org": { "org": string };
    "/api/v1/:org/apps": { "org": string };
    "/api/v1/:org/apps/:app": { "org": string, "app": string };
    "/api/v1/access-keys": Record<string, never>;
    "/api/v1/auth/status": Record<string, never>;
    "/api/v1/tenants": Record<string, never>;
    "/auth/:provider": { "provider": string };
    "/auth/:provider/callback": { "provider": string };
    "/dashboard": Record<string, never>;
    "/dashboard/:org/:app": { "org": string, "app": string };
    "/dashboard/:org/apps": { "org": string };
    "/dashboard/:org/manage": { "org": string };
    "/dashboard/create/app": Record<string, never>;
    "/dashboard/create/org": Record<string, never>;
    "/dashboard/delete": Record<string, never>;
    "/dashboard/tokens": Record<string, never>;
    "/healthcheck": Record<string, never>;
    "/login": Record<string, never>;
    "/logout": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/api/v1/:app/collaborators", RouteParams["/api/v1/:app/collaborators"]]
      | ["/api/v1/:app/deployments", RouteParams["/api/v1/:app/deployments"]]
      | ["/api/v1/:app/deployments/:deploymentName", RouteParams["/api/v1/:app/deployments/:deploymentName"]]
      | ["/api/v1/:app/deployments/:deploymentName/promote/:targetDeployment", RouteParams["/api/v1/:app/deployments/:deploymentName/promote/:targetDeployment"]]
      | ["/api/v1/:app/deployments/:deploymentName/releases", RouteParams["/api/v1/:app/deployments/:deploymentName/releases"]]
      | ["/api/v1/:org", RouteParams["/api/v1/:org"]]
      | ["/api/v1/:org/apps", RouteParams["/api/v1/:org/apps"]]
      | ["/api/v1/:org/apps/:app", RouteParams["/api/v1/:org/apps/:app"]]
      | ["/api/v1/access-keys"]
      | ["/api/v1/auth/status"]
      | ["/api/v1/tenants"]
      | ["/auth/:provider", RouteParams["/auth/:provider"]]
      | ["/auth/:provider/callback", RouteParams["/auth/:provider/callback"]]
      | ["/dashboard"]
      | ["/dashboard/:org/:app", RouteParams["/dashboard/:org/:app"]]
      | ["/dashboard/:org/apps", RouteParams["/dashboard/:org/apps"]]
      | ["/dashboard/:org/manage", RouteParams["/dashboard/:org/manage"]]
      | ["/dashboard/create/app"]
      | ["/dashboard/create/org"]
      | ["/dashboard/delete"]
      | ["/dashboard/tokens"]
      | ["/healthcheck"]
      | ["/login"]
      | ["/logout"]
  >(...args: T): typeof args[0];
}

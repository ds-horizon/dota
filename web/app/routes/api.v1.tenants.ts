import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import { authenticateLoaderRequest } from "~/utils/authenticate";

export const loader = authenticateLoaderRequest(async ({ user }) => {
  const { data, status } = await CodepushService.getTenants(user.user.id);
  return json(data, { status });
});

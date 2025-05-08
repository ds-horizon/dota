import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

const createToken: AuthenticatedActionFunction = async ({ user, request }) => {
  const body = await request.json();
  const { data, status } = await CodepushService.createAccessKey({
    userId: user.user.id,
    name: body.name ?? "",
    access: body.access ?? "",
  });
  return json(data, { status });
};

const deleteToken: AuthenticatedActionFunction = async ({ user, request }) => {
  const { data, status } = await CodepushService.deleteAccessKey({
    userId: user.user.id,
    name: request.headers.get("name") ?? "",
  });
  return json(data, { status });
};

export const loader = authenticateLoaderRequest(async ({ user }) => {
  const { data, status } = await CodepushService.getAccessKeys({
    userId: user.user.id,
  });
  return json(data, { status });
});

export const action = authenticateActionRequest({
  POST: createToken,
  DELETE: deleteToken,
});

export type User = {
  authenticated: boolean;
  user: {
    createdTime: number;
    name: string;
    email: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
};

import type { Session, SessionData } from "@remix-run/node";

export enum AuthenticatorRoutes {
  LOGIN = "/login",
  LOGOUT = "/logout",
}

export type GetUserReturnType = {
  user: null | User;
  session: Session<SessionData, SessionData>;
};

// Define a type for a redirect response
interface RedirectResponse {
  redirect: true;
  url: string;
  cookieHeader: string;
  user?: never;
}

export type UserReturnType = GetUserReturnType | RedirectResponse;

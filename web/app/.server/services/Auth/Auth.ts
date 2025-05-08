import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";

import { SessionStorageService } from "../SessionStorage";

import { getAuthenticatorCallbackUrl } from "./Auth.utils";
import { AuthenticatorRoutes, User, UserReturnType } from "./Auth.interface";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  TypedResponse,
} from "@remix-run/node";
import { env } from "../config";
import { CodepushService } from "../Codepush";
import { redirectTo } from "../Cookie";

export enum SocialsProvider {
  GOOGLE = "google",
}

type AuthRequest =
  | LoaderFunctionArgs["request"]
  | ActionFunctionArgs["request"];

export class Auth {
  static authenticator = new Authenticator<User>(
    SessionStorageService.sessionStorage,
    {
      sessionKey: SessionStorageService.sessionKey,
    }
  );

  constructor() {
    Auth.authenticator.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
          callbackURL: getAuthenticatorCallbackUrl(SocialsProvider.GOOGLE),
          prompt: "consent",
        },
        async (args) => {
          console.log("args in constructing Auth:", args);
          return CodepushService.getUser(args.extraParams.id_token);
        }
      )
    );
  }

  async getUser(request: AuthRequest): Promise<UserReturnType> {
    const session = await SessionStorageService.sessionStorage.getSession(
      request.headers.get("Cookie")
    );

    const user = session.get("_session") ?? null;

    if (user) {
      try {
        const currentUser = "hello";
        session.set("_session", currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        session.unset("_session");
        const cookieHeader =
          await SessionStorageService.sessionStorage.commitSession(session);
        return {
          redirect: true,
          url: AuthenticatorRoutes.LOGIN,
          cookieHeader,
        };
      }
    }

    return { user: session.get("_session") ?? null, session };
  }

  async callback(provider: SocialsProvider, request: AuthRequest) {
    const redirectUri = await redirectTo.parse(request.headers.get("Cookie"));
    console.log("redirectUri:", redirectUri, request.headers.get("Cookie"));
    return Auth.authenticator.authenticate(provider, request, {
      failureRedirect: AuthenticatorRoutes.LOGIN,
      successRedirect: redirectUri ?? "/dashboard",
    });
  }

  async authenticate(provider: SocialsProvider, request: AuthRequest) {
    return Auth.authenticator.authenticate(provider, request);
  }

  async isAuthenticated(
    request: AuthRequest
  ): Promise<User | TypedResponse<never>> {
    console.log("headers:", request.headers.entries());
    const apiKey = request.headers.get("api-key") ?? "";

    if (apiKey.length) {
      const { data } = await CodepushService.getUserByAccessKey(apiKey);
      return { ...data, authenticated: true };
    }

    try {
      console.log("Trying to authenticate:")
      return await Auth.authenticator.authenticate(
        SocialsProvider.GOOGLE,
        request,
        {
          throwOnError: true,
        }
      );
    } catch (e) {
      console.log("error", e);
      return redirect(AuthenticatorRoutes.LOGIN, {
        headers: {
          "Set-Cookie": await redirectTo.serialize(
            new URL(request.url).pathname
          ),
        },
      });
    }
  }

  async isLoggedIn(request: AuthRequest) {
    return await Auth.authenticator.isAuthenticated(request, {
      successRedirect: "/dashboard",
    });
  }

  async logout(request: AuthRequest) {
    return await Auth.authenticator.logout(request, {
      redirectTo: AuthenticatorRoutes.LOGIN,
    });
  }
}

const AuthenticatorService = new Auth();

export { AuthenticatorService };

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

// Development token taken from environment variable
const DEV_TOKEN: string = process.env.token_env || "mock-google-token";

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
    // Only set up Google strategy if credentials are available
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      Auth.authenticator.use(
        new GoogleStrategy(
          {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: getAuthenticatorCallbackUrl(SocialsProvider.GOOGLE),
            prompt: "consent",
          },
          async (args) => {
            console.log("args in constructing Auth:", args);
            return CodepushService.getUser(args.extraParams.id_token);
          }
        )
      );
    } else {
      console.warn("Google OAuth credentials not found, using mock authentication only");
    }
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
    
    // If Google credentials are missing, handle with mock token
    if ((provider === SocialsProvider.GOOGLE) && 
        (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)) {
      try {
        // Get mock user
        const mockUser = await CodepushService.getUser(DEV_TOKEN);
        
        // Create a session for the mock user
        const session = await SessionStorageService.sessionStorage.getSession();
        session.set(SessionStorageService.sessionKey, mockUser);
        
        // Redirect with the session
        return redirect(redirectUri ?? "/dashboard", {
          headers: {
            "Set-Cookie": await SessionStorageService.sessionStorage.commitSession(session),
          },
        });
      } catch (error) {
        console.error("Error authenticating with mock token:", error);
        return redirect(AuthenticatorRoutes.LOGIN);
      }
    }
    
    return Auth.authenticator.authenticate(provider, request, {
      failureRedirect: AuthenticatorRoutes.LOGIN,
      successRedirect: redirectUri ?? "/dashboard",
    });
  }

  async authenticate(provider: SocialsProvider, request: AuthRequest) {
    // If Google credentials are missing, use mock token
    if (provider === SocialsProvider.GOOGLE && 
        (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)) {
      try {
        const mockUser = await CodepushService.getUser(DEV_TOKEN);
        return mockUser;
      } catch (error) {
        console.error("Error authenticating with mock token:", error);
        throw error;
      }
    }
    
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
      console.log("Trying to authenticate:");
      
      // Handle mock Google token in development environment
      if (process.env.NODE_ENV === "development" && 
          env.LOCAL_GOOGLE_TOKEN && 
          request.headers.get("Authorization")?.includes(DEV_TOKEN)) {
        try {
          // Use CodepushService.getUser with development token
          const userData = await CodepushService.getUser(DEV_TOKEN);
          if (userData && userData.authenticated) {
            return userData;
          }
        } catch (error) {
          console.error("Error authenticating with mock token:", error);
        }
      }
      
      // If Google credentials are missing, use mock token
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        try {
          const mockUser = await CodepushService.getUser(DEV_TOKEN);
          return mockUser;
        } catch (error) {
          console.error("Error authenticating with mock token:", error);
          throw error;
        }
      }
      
      // Use standard Google OAuth flow for non-mock tokens
      return await Auth.authenticator.authenticate(
        SocialsProvider.GOOGLE,
        request,
        {
          throwOnError: true,
        }
      );
    } catch (e) {
      console.log("Google authentication error:", e);
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
    // If Google credentials are missing, use mock authentication
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      try {
        const mockUser = await CodepushService.getUser(DEV_TOKEN);
        const session = await SessionStorageService.sessionStorage.getSession();
        session.set(SessionStorageService.sessionKey, mockUser);
        
        return redirect("/dashboard", {
          headers: {
            "Set-Cookie": await SessionStorageService.sessionStorage.commitSession(session),
          },
        });
      } catch (error) {
        console.error("Error with mock authentication:", error);
      }
    }
    
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

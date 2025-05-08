"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const google_auth_library_1 = require("google-auth-library");
const cookieSession = require("cookie-session");
const express_1 = require("express");
const express_rate_limit_1 = require("express-rate-limit");
const tracer_1 = require("../utils/tracer");
// Replace with your actual Google Client ID (from Google Developer Console)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "<Your Google Client ID>";
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
class Authentication {
    _cookieSessionMiddleware;
    _serverUrl;
    _storageInstance;
    constructor(config) {
        this._serverUrl = process.env["SERVER_URL"];
        // Session middleware setup
        this._cookieSessionMiddleware = cookieSession({
            httpOnly: true,
            ttl: 3600000,
            name: "oauth.session",
            path: "/",
            signed: false,
            overwrite: true,
        });
        this._storageInstance = config.storage;
    }
    // Validate the Google ID token received from the client or web dashboard
    async verifyGoogleToken(idToken) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: GOOGLE_CLIENT_ID, // Make sure this matches the client ID used in your app
            });
            const payload = ticket.getPayload();
            return payload; // Return the user info from Google token
        }
        catch (error) {
            (0, tracer_1.sendErrorToDatadog)(new Error("401: Unauthorised Invalid Google Token"));
            throw new Error("Invalid Google token");
        }
    }
    async getOrCreateUser(payload) {
        try {
            return await this._storageInstance.getAccountByEmail(payload.email);
        }
        catch (e) {
            await this._storageInstance.addAccount({
                createdTime: Date.now(),
                email: payload.email,
                name: payload.name,
            });
            return await this._storageInstance.getAccountByEmail(payload.email);
        }
    }
    async getUserById(userId) {
        try {
            return await this._storageInstance.getAccount(userId);
        }
        catch (e) {
            (0, tracer_1.sendErrorToDatadog)(new Error("403: User Not found"));
            throw new Error("No User found");
        }
    }
    // Middleware to authenticate requests using Google ID token
    async authenticate(req, res, next) {
        // Bypass authentication in development mode
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
            let token = req.headers.authorization?.split("Bearer ")[1];
            if (token.startsWith("cli-"))
                // Handle CLI access with access key
                token = req.headers.authorization.split("cli-")[1];
            // If token is provided, check if it's valid
            if (token) {
                try {
                    // Use the storage mechanism to look up the token, just like in production
                    const user = await this._storageInstance.getUserFromAccessToken(token);
                    if (user) {
                        req.user = user;
                        return next();
                    }
                    else {
                        // For expired or invalid tokens, return 401
                        return res.status(401).send("Access key has expired or is invalid");
                    }
                }
                catch (error) {
                    // If there's an error looking up the token, return 401
                    return res.status(401).send("Invalid Access token");
                }
            }
            else {
                const userId = Array.isArray(req.headers.userid) ? req.headers.userid[0] : req.headers.userid;
                if (userId) {
                    const user = await this.getUserById(userId);
                    if (user) {
                        req.user = {
                            id: userId
                        };
                        return next();
                    }
                    else {
                        return res.status(401).send("User not found");
                    }
                }
                else {
                    return res.status(401).send("Missing token and userid");
                }
            }
        }
        // In production, validate the Google ID token
        try {
            const idToken = req.headers.authorization?.split("Bearer ")[1];
            if (!idToken) {
                const userId = Array.isArray(req.headers.userid) ? req.headers.userid[0] : req.headers.userid;
                if (userId) {
                    const user = await this.getUserById(userId);
                    if (user) {
                        req.user = {
                            id: userId
                        };
                        return next();
                    }
                    else {
                        return res.status(401).send("User not found");
                    }
                }
                else {
                    return res.status(401).send("Missing Google ID token");
                }
            }
            if (idToken.startsWith("cli-")) {
                // Handle CLI access with access key
                const accessToken = idToken.split("cli-")[1];
                const user = await this._storageInstance.getUserFromAccessToken(accessToken);
                if (user) {
                    req.user = { id: user.id };
                    return next();
                }
                else {
                    return res.status(401).send("Authentication failed by access key");
                }
            }
            else {
                // Verify Google ID token
                const payload = await this.verifyGoogleToken(idToken);
                if (!payload) {
                    return res.status(401).send("Invalid Google ID token");
                }
                // Check user exists in the storage
                const userEmail = payload.email;
                const user = await this.getOrCreateUser(payload);
                if (!user) {
                    return res.status(401).send("User not found in the system");
                }
                else {
                    // Update user info if it has changed
                    if (user.name !== payload.name) {
                        user.name = payload.name;
                        await this._storageInstance.addAccount(user);
                        //return this._storageInstance
                        // .addAccount(newUser)
                        // .then((accountId: string): Promise<void> => issueAccessKey(accountId));
                    }
                }
                // Attach the user to the request object
                req.user = user;
                next();
            }
        }
        catch (error) {
            res.status(401).send("Authentication failed");
        }
    }
    // Main router for handling requests
    getRouter() {
        const router = (0, express_1.Router)();
        router.use(this._cookieSessionMiddleware);
        // Example protected route
        router.get("/authenticated", (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }), this.authenticate.bind(this), (req, res) => {
            res.send({ authenticated: true, user: req.user });
        });
        return router;
    }
}
exports.Authentication = Authentication;

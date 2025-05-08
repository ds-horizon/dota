"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const shortid = require("shortid");
const redis_manager_1 = require("../script/redis-manager");
class DummyExpressResponse {
    statusCode;
    body;
    locals = {};
    status(statusCode) {
        assert(!this.statusCode, "Status code already set");
        this.statusCode = statusCode;
        return this;
    }
    send(body) {
        assert(!this.body, "Body already set");
        this.body = body;
        return this;
    }
    reset() {
        this.statusCode = undefined;
        this.body = undefined;
        this.locals = {};
    }
}
const redisManager = new redis_manager_1.RedisManager();
const dummyExpressResponse = new DummyExpressResponse();
const expectedResponse = {
    statusCode: 200,
    body: "",
};
describe("Redis Cache Middleware", () => {
    beforeAll(async () => {
        if (!redisManager.isEnabled) {
            console.log("Redis is not configured... Skipping Redis tests");
        }
    });
    afterAll(async () => {
        await redisManager.close();
    });
    it("should be healthy by default", async () => {
        await redisManager.checkHealth();
    });
    it("first cache request should return null", async () => {
        const expiryKey = `test:${shortid.generate()}`;
        const url = shortid.generate();
        const cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse).toBeNull();
    });
    it("should get cache request after setting it once", async () => {
        const expiryKey = `test:${shortid.generate()}`;
        const url = shortid.generate();
        expectedResponse.statusCode = 200;
        expectedResponse.body = "I am cached";
        let cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse).toBeNull();
        await redisManager.setCachedResponse(expiryKey, url, expectedResponse);
        cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse?.statusCode).toBe(expectedResponse.statusCode);
        expect(cacheResponse?.body).toBe(expectedResponse.body);
        const newUrl = shortid.generate();
        cacheResponse = await redisManager.getCachedResponse(expiryKey, newUrl);
        expect(cacheResponse).toBeNull();
    });
    it("should be able to invalidate cached request", async () => {
        const expiryKey = `test:${shortid.generate()}`;
        const url = shortid.generate();
        expectedResponse.statusCode = 200;
        expectedResponse.body = "I am cached";
        let cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse).toBeNull();
        await redisManager.setCachedResponse(expiryKey, url, expectedResponse);
        cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse?.statusCode).toBe(expectedResponse.statusCode);
        expect(cacheResponse?.body).toBe(expectedResponse.body);
        expectedResponse.body = "I am a new body";
        await redisManager.invalidateCache(expiryKey);
        cacheResponse = await redisManager.getCachedResponse(expiryKey, url);
        expect(cacheResponse).toBeNull();
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = exports.Utilities = exports.DOWNLOADED = exports.ACTIVE = exports.DEPLOYMENT_FAILED = exports.DEPLOYMENT_SUCCEEDED = void 0;
// import * as redis from "redis";
const ioredis_1 = require("ioredis");
const tracer_1 = require("./utils/tracer");
exports.DEPLOYMENT_SUCCEEDED = "DeploymentSucceeded";
exports.DEPLOYMENT_FAILED = "DeploymentFailed";
exports.ACTIVE = "Active";
exports.DOWNLOADED = "Downloaded";
var Utilities;
(function (Utilities) {
    function isValidDeploymentStatus(status) {
        return status === exports.DEPLOYMENT_SUCCEEDED || status === exports.DEPLOYMENT_FAILED || status === exports.DOWNLOADED;
    }
    Utilities.isValidDeploymentStatus = isValidDeploymentStatus;
    function getLabelStatusField(label, status) {
        if (isValidDeploymentStatus(status)) {
            return label + ":" + status;
        }
        else {
            return null;
        }
    }
    Utilities.getLabelStatusField = getLabelStatusField;
    function getLabelActiveCountField(label) {
        if (label) {
            return label + ":" + exports.ACTIVE;
        }
        else {
            return null;
        }
    }
    Utilities.getLabelActiveCountField = getLabelActiveCountField;
    function getDeploymentKeyHash(deploymentKey) {
        return "deploymentKey:" + deploymentKey;
    }
    Utilities.getDeploymentKeyHash = getDeploymentKeyHash;
    function getDeploymentKeyLabelsHash(deploymentKey) {
        return "deploymentKeyLabels:" + deploymentKey;
    }
    Utilities.getDeploymentKeyLabelsHash = getDeploymentKeyLabelsHash;
    function getDeploymentKeyClientsHash(deploymentKey) {
        return "deploymentKeyClients:" + deploymentKey;
    }
    Utilities.getDeploymentKeyClientsHash = getDeploymentKeyClientsHash;
})(Utilities || (exports.Utilities = Utilities = {}));
class PromisifiedRedisClient {
    client;
    constructor(client) {
        this.client = client;
    }
    async set(key, value, expiry) {
        const setAsync = (this.client.set).bind(this.client);
        const args = expiry ? [key, value, "EX", expiry] : [key, value];
        await setAsync(...args);
    }
    async get(key) {
        const getAsync = (this.client.get).bind(this.client);
        return await getAsync(key);
    }
    async exists(...keys) {
        const existsAsync = (this.client.exists).bind(this.client);
        return await existsAsync(...keys);
    }
    async hget(key, field) {
        const hgetAsync = (this.client.hget).bind(this.client);
        return await hgetAsync(key, field);
    }
    async hdel(key, field) {
        const hdelAsync = (this.client.hdel).bind(this.client);
        return await hdelAsync(key, field);
    }
    async hset(key, field, value) {
        const hsetAsync = (this.client.hset).bind(this.client);
        return await hsetAsync(key, field, value);
    }
    async del(key) {
        const delAsync = (this.client.del).bind(this.client);
        return await delAsync(key);
    }
    async ping() {
        const pingAsync = (this.client.ping).bind(this.client);
        return await pingAsync();
    }
    async hgetall(key) {
        console.log("hgetall key:", key);
        const hgetallAsync = (this.client.hgetall).bind(this.client);
        return await hgetallAsync(key);
    }
    // public execBatch(redisBatchClient: BatchC): Promise<any[]> {
    //   new Redis().pipeline();
    //   return q.ninvoke<any[]>(redisBatchClient, "exec");
    // }
    async expire(key, seconds) {
        const expireAsync = (this.client.expire).bind(this.client);
        return await expireAsync(key, seconds);
    }
    async hincrby(key, field, incrementBy) {
        const hincrbyAsync = (this.client.hincrby).bind(this.client);
        return await hincrbyAsync(key, field, incrementBy);
    }
    async quit() {
        const quitAsync = (this.client.quit).bind(this.client);
        await quitAsync();
    }
}
class RedisManager {
    static DEFAULT_EXPIRY = 3600; // one hour, specified in seconds
    _opsClient = null;
    _promisifiedOpsClient = null;
    _metricsClient = null;
    _promisifiedMetricsClient = null;
    _setupMetricsClientPromise = null;
    constructor() {
        if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
            const redisConfig = {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
                // auth_pass: process.env.REDIS_KEY,
                // tls: {
                //   // Note: Node defaults CA's to those trusted by Mozilla
                //   rejectUnauthorized: true,
                // },
            };
            const clusterRetryStrategy = (times) => {
                // Customize retry logic; return null to stop retrying
                if (times > 5) {
                    console.error("Too many retries. Giving up.");
                    return null;
                }
                return Math.min(times * 100, 3000); // Incremental delay
            };
            const options = {
                redisOptions: {
                    connectTimeout: 15000,
                    maxRetriesPerRequest: 5, // Max retries for a failed request
                },
                scaleReads: "all",
                clusterRetryStrategy: clusterRetryStrategy,
            };
            const startUpNodes = [
                {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT),
                },
            ];
            console.log("value ", process.env.REDIS_CLUSTER_ENABLED);
            console.log("typeof ", typeof process.env.REDIS_CLUSTER_ENABLED);
            const clusterEnabledWithDoubleEqual = process.env.REDIS_CLUSTER_ENABLED === "true";
            const clusterEnabledWithTrippleEqual = process.env.REDIS_CLUSTER_ENABLED === "true";
            console.log("clusterEnabledWithDoubleEqual", clusterEnabledWithDoubleEqual);
            console.log("clusterEnabledWithTrippleEqual", clusterEnabledWithTrippleEqual);
            if (process.env.REDIS_CLUSTER_ENABLED === "true") {
                console.log("startUpNodes, options", startUpNodes, options);
            }
            else {
                console.log("Redis config since no cluster enabled:", redisConfig);
            }
            this._opsClient = process.env.REDIS_CLUSTER_ENABLED === "true" ? new ioredis_1.Cluster(startUpNodes, options) : new ioredis_1.Redis(redisConfig);
            this._metricsClient = process.env.REDIS_CLUSTER_ENABLED === "true" ? new ioredis_1.Cluster(startUpNodes, options) : new ioredis_1.Redis(redisConfig);
            this._opsClient.on("error", (err) => {
                console.error("Redis ops client error:", err);
            });
            this._metricsClient.on("error", (err) => {
                console.error("Redis Metrics client error:", err);
            });
            this._promisifiedOpsClient = new PromisifiedRedisClient(this._opsClient);
            this._promisifiedMetricsClient = new PromisifiedRedisClient(this._metricsClient);
            this._setupMetricsClientPromise = this._promisifiedMetricsClient
                .set("health", "healthy")
                .then(() => { })
                .catch((err) => console.error("Failed to set initial health status:", err));
        }
        else {
            console.log("No REDIS_HOST or REDIS_PORT environment variable configured.");
        }
    }
    get isEnabled() {
        return !!this._opsClient && !!this._metricsClient;
    }
    checkHealth() {
        if (!this.isEnabled) {
            return Promise.reject("Redis manager is not enabled");
        }
        console.log("Starting Redis health check...");
        return Promise
            .all([
            this._promisifiedOpsClient.ping().then(() => console.log("Ops Client Ping successful")),
            this._promisifiedMetricsClient.ping().then(() => console.log("Metrics Client Ping successful")),
        ])
            .then(() => {
            console.log("Redis health check passed.");
        })
            .catch((err) => {
            console.error("Redis health check failed:", err);
            (0, tracer_1.sendErrorToDatadog)(err);
            throw err;
        });
    }
    /**
     * Get a response from cache if possible, otherwise return null.
     * @param expiryKey: An identifier to get cached response if not expired
     * @param url: The url of the request to cache
     * @return The object of type CacheableResponse
     */
    getCachedResponse(expiryKey, url) {
        if (!this.isEnabled) {
            return Promise.resolve((null));
        }
        return this._promisifiedOpsClient.hget(expiryKey, url).then((serializedResponse) => {
            if (serializedResponse) {
                const response = JSON.parse(serializedResponse);
                return Promise.resolve((response));
            }
            else {
                return Promise.resolve((null));
            }
        });
    }
    /**
     * Set a response in redis cache for given expiryKey and url.
     * @param expiryKey: An identifier that you can later use to expire the cached response
     * @param url: The url of the request to cache
     * @param response: The response to cache
     */
    setCachedResponse(expiryKey, url, response) {
        if (!this.isEnabled) {
            return Promise.resolve((null));
        }
        // Store response in cache with a timed expiry
        const serializedResponse = JSON.stringify(response);
        let isNewKey;
        return this._promisifiedOpsClient
            .exists(expiryKey)
            .then((isExisting) => {
            isNewKey = !isExisting;
            return this._promisifiedOpsClient.hset(expiryKey, url, serializedResponse);
        })
            .then(() => {
            if (isNewKey) {
                return this._promisifiedOpsClient.expire(expiryKey, RedisManager.DEFAULT_EXPIRY);
            }
        })
            .then(() => { });
    }
    invalidateCache(expiryKey) {
        if (!this.isEnabled)
            return Promise.resolve(null);
        return this._promisifiedOpsClient.del(expiryKey).then(() => { });
    }
    // Atomically increments the status field for the deployment by 1,
    // or 1 by default. If the field does not exist, it will be created with the value of 1.
    incrementLabelStatusCount(deploymentKey, label, status) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        const hash = Utilities.getDeploymentKeyLabelsHash(deploymentKey);
        const field = Utilities.getLabelStatusField(label, status);
        return this._setupMetricsClientPromise.then(() => this._promisifiedMetricsClient.hincrby(hash, field, 1)).then(() => { });
    }
    clearMetricsForDeploymentKey(deploymentKey) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise
            .then(() => this._promisifiedMetricsClient.del(Utilities.getDeploymentKeyLabelsHash(deploymentKey))).then(() => this._promisifiedMetricsClient.del(Utilities.getDeploymentKeyClientsHash(deploymentKey)))
            .then(() => { });
    }
    // Promised return value will look something like
    // { "v1:DeploymentSucceeded": 123, "v1:DeploymentFailed": 4, "v1:Active": 123 ... }
    getMetricsWithDeploymentKey(deploymentKey) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise
            .then(() => this._promisifiedMetricsClient.hgetall(Utilities.getDeploymentKeyLabelsHash(deploymentKey)))
            .then((metrics) => {
            // Redis returns numerical values as strings, handle parsing here.
            if (metrics) {
                Object.keys(metrics).forEach((metricField) => {
                    if (!isNaN(metrics[metricField])) {
                        metrics[metricField] = +metrics[metricField];
                    }
                });
            }
            return metrics;
        });
    }
    recordUpdate(currentDeploymentKey, currentLabel, previousDeploymentKey, previousLabel) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise
            .then(() => {
            const batchClient = this._metricsClient.pipeline();
            const currentDeploymentKeyLabelsHash = Utilities.getDeploymentKeyLabelsHash(currentDeploymentKey);
            const currentLabelActiveField = Utilities.getLabelActiveCountField(currentLabel);
            const currentLabelDeploymentSucceededField = Utilities.getLabelStatusField(currentLabel, exports.DEPLOYMENT_SUCCEEDED);
            batchClient.hincrby(currentDeploymentKeyLabelsHash, currentLabelActiveField, /* incrementBy */ 1);
            batchClient.hincrby(currentDeploymentKeyLabelsHash, currentLabelDeploymentSucceededField, /* incrementBy */ 1);
            if (previousDeploymentKey && previousLabel) {
                const previousDeploymentKeyLabelsHash = Utilities.getDeploymentKeyLabelsHash(previousDeploymentKey);
                const previousLabelActiveField = Utilities.getLabelActiveCountField(previousLabel);
                batchClient.hincrby(previousDeploymentKeyLabelsHash, previousLabelActiveField, /* incrementBy */ -1);
            }
            return batchClient.exec(batchClient);
        })
            .then(() => { });
    }
    removeDeploymentKeyClientActiveLabel(deploymentKey, clientUniqueId) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise
            .then(() => {
            const deploymentKeyClientsHash = Utilities.getDeploymentKeyClientsHash(deploymentKey);
            return this._promisifiedMetricsClient.hdel(deploymentKeyClientsHash, clientUniqueId);
        })
            .then(() => { });
    }
    // For unit tests only
    close() {
        const promiseChain = Promise.resolve(null);
        if (!this._opsClient && !this._metricsClient)
            return promiseChain;
        return promiseChain
            .then(() => this._opsClient && this._promisifiedOpsClient.quit())
            .then(() => this._metricsClient && this._promisifiedMetricsClient.quit())
            .then(() => null);
    }
    /* deprecated */
    getCurrentActiveLabel(deploymentKey, clientUniqueId) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise.then(() => this._promisifiedMetricsClient.hget(Utilities.getDeploymentKeyClientsHash(deploymentKey), clientUniqueId));
    }
    /* deprecated */
    updateActiveAppForClient(deploymentKey, clientUniqueId, toLabel, fromLabel) {
        if (!this.isEnabled) {
            return Promise.resolve(null);
        }
        return this._setupMetricsClientPromise
            .then(() => {
            const batchClient = this._metricsClient.pipeline();
            const deploymentKeyLabelsHash = Utilities.getDeploymentKeyLabelsHash(deploymentKey);
            const deploymentKeyClientsHash = Utilities.getDeploymentKeyClientsHash(deploymentKey);
            const toLabelActiveField = Utilities.getLabelActiveCountField(toLabel);
            batchClient.hset(deploymentKeyClientsHash, clientUniqueId, toLabel);
            batchClient.hincrby(deploymentKeyLabelsHash, toLabelActiveField, /* incrementBy */ 1);
            if (fromLabel) {
                const fromLabelActiveField = Utilities.getLabelActiveCountField(fromLabel);
                // First, check the current value before decrementing
                return this._metricsClient.hget(deploymentKeyLabelsHash, fromLabelActiveField)
                    .then((currentValue) => {
                    const currentCount = currentValue ? parseInt(currentValue, 10) : 0;
                    if (currentCount > 0) {
                        batchClient.hincrby(deploymentKeyLabelsHash, fromLabelActiveField, -1);
                    }
                    else {
                        console.log(`Attempted to decrement ${fromLabelActiveField}, but it is already 0.`);
                    }
                    return batchClient.exec();
                });
            }
            else {
                return batchClient.exec();
            }
        })
            .then(() => { });
    }
}
exports.RedisManager = RedisManager;

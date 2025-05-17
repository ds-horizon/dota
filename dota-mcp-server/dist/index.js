"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const mcpTools_1 = require("./routes/mcpTools");
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const fastify = (0, fastify_1.default)();
const mcpServer = new mcp_js_1.McpServer({
    name: 'dota-mcp-server',
    version: '0.1.0',
});
// TODO: Register context/resource handlers here
fastify.all('/mcp', async (request, reply) => {
    const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
        sessionIdGenerator: () => uuidv4(),
    });
    await mcpServer.connect(transport);
});
// MCP Tools API routes
fastify.post('/cli/login', mcpTools_1.loginHandler);
fastify.get('/cli/config', mcpTools_1.getConfigHandler);
fastify.get('/cli/seed-data', mcpTools_1.getSeedDataHandler);
fastify.post('/cli/release', mcpTools_1.releaseUpdateHandler);
fastify.get('/cli/adoption', mcpTools_1.getAdoptionStatsHandler);
fastify.get('/cli/overview', mcpTools_1.getOverviewHandler);
fastify.listen({ port: 4000 }, (err) => {
    if (err)
        throw err;
    console.log('DOTA MCP Server running on port 4000');
});

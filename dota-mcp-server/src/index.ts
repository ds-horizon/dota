import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import {
  loginHandler,
  getConfigHandler,
  getSeedDataHandler,
  releaseUpdateHandler,
  getAdoptionStatsHandler,
  getOverviewHandler
} from './routes/mcpTools';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const fastify = Fastify();
const mcpServer = new McpServer({
  name: 'dota-mcp-server',
  version: '0.1.0',
});

// TODO: Register context/resource handlers here

fastify.all('/mcp', async (request: FastifyRequest, reply: FastifyReply) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => uuidv4(),
  });
  await mcpServer.connect(transport);
});

// MCP Tools API routes
fastify.post('/cli/login', loginHandler);
fastify.get('/cli/config', getConfigHandler);
fastify.get('/cli/seed-data', getSeedDataHandler);
fastify.post('/cli/release', releaseUpdateHandler);
fastify.get('/cli/adoption', getAdoptionStatsHandler);
fastify.get('/cli/overview', getOverviewHandler);

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('DOTA MCP Server running on port 4000');
}); 
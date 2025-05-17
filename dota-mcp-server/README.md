# DOTA Model Context Protocol Server (dota-mcp-server)

## 🧠 Objective

We are building a TypeScript-based Fastify backend named `dota-mcp-server`. This server acts as the **central orchestrator** for the DOTA (Developer OTA) ecosystem — similar to GitHub's MCP server — and provides a unified protocol layer for CLI, web console, simulators/emulators, OTA updates, and agent-based workflows.

This server is responsible for maintaining **structured context state** for builds, deployments, devices, projects, agents, and terminal logs, and should expose REST + WebSocket APIs for all integration points.

It will eventually support intelligent agents, automated update flows, release strategy plugins, and terminal-based operations.

---

## 📦 Folder Structure

dota-mcp-server/
src/
contexts/ # Shared context definitions
project.ts
build.ts
release.ts
device.ts
agent.ts
terminal.ts
routes/ # API routes
index.ts
deploy.ts
context.ts
services/ # Context-aware business logic
otaService.ts
cliRunner.ts
websocket/ # WebSocket setup and handlers
socketHandler.ts
index.ts # Server entrypoint
Dockerfile
docker-compose.yml
tsconfig.json
package.json
README.md

---

## 🧩 Features

- Fastify-based server running at port `4000`
- RESTful endpoints under `/api/*`
- WebSocket support using `socket.io` for live events (like build status, deploy events)
- Context stores using in-memory singletons (later can extend to Redis)
- Simulated OTA deployment with logs
- CLI integration to trigger build or deploy from server
- Dockerized for local and remote deployment

---

## 🧠 Context Interfaces

We maintain the following structured MCP contexts:

### `ProjectContext`
```ts
{
  projectId: string;
  platform: 'android' | 'ios' | 'web';
  repoUrl: string;
  branch: string;
  activeComponent?: string;
}

BuildContext
{
  projectId: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  artifacts: string[];
  log: string;
}
ReleaseContext
{
  strategyId: string;
  rollout: number;
  cohort: string;
  targetPlatform: string;
  description?: string;
}
DeviceContext
{
  deviceId: string;
  projectId: string;
  status: 'idle' | 'installing' | 'updated';
  installedVersion: string;
}
AgentContext
{
  taskId: string;
  goal: string;
  actions: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}
TerminalLogContext
{
  sessionId: string;
  command: string;
  output: string[];
}
```

🔌 Initial REST Endpoints

POST /api/deploy → triggers OTA deploy using release strategy
GET /api/context/:projectId → returns all current context data
POST /api/agent/task → accepts an agent execution plan
GET /api/build/status → returns latest build context

🔄 WebSocket Events

Emitted using socket.io, some examples:

build-status → { projectId, status }
deploy-progress → { projectId, percent }
terminal-output → { sessionId, line }

🐳 Docker Setup

Dockerfile to containerize the MCP server
docker-compose.yml for local dev with volume mounting and hot reload

🔧 NPM Scripts

"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "build": "tsup src/index.ts --out-dir dist --format esm",
  "start": "node dist/index.js"
}

🧠 Cursor Instructions

Cursor should:

Use TypeScript with Fastify
Generate context modules with types + initial state
Scaffold REST routes + sample handlers (e.g., deploy)
Add simple socket.io-based event emitter (stub for now)
Create a functional Dockerfile + Compose file
Ensure modular structure to allow plugin extensions later
This system will power a React-based orchestration UI and intelligent agents to drive OTA updates and testing.

---

Let me know if you want to generate the initial files (`index.ts`, `project.ts`, `deploy.ts`, `Dockerfile`, etc.) from this `prompt.md`. 
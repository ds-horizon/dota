# DOTA Chatbot Integration

A comprehensive end-to-end chatbot solution for the DOTA (Over-The-Air) management system, integrated with OpenAI and MCP (Model Context Protocol) server.

## 🎯 Overview

This integration provides:
- **AI-powered chatbot** on the web dashboard
- **OpenAI GPT-4 integration** for natural language processing
- **MCP server** for DOTA management operations
- **Real-time communication** between chatbot and DOTA APIs
- **Authenticated access** with user context

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │   MCP Server    │    │   DOTA API      │
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │   Chatbot   ││───▶│  │ HTTP Server ││───▶│  │ REST API    ││
│  │ Component   ││    │  │             ││    │  │             ││
│  └─────────────┘│    │  └─────────────┘│    │  └─────────────┘│
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │                 │
│  │   OpenAI    ││───▶│  │ Tool Engine ││    │                 │
│  │Integration  ││    │  │             ││    │                 │
│  └─────────────┘│    │  └─────────────┘│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     Port: 3001            Port: 3001             Port: 3000
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x
- OpenAI API key
- Running DOTA API server (port 3000)

### Setup & Run

1. **Setup environment**:
   ```bash
   chmod +x setup-chatbot-env.sh
   ./setup-chatbot-env.sh
   ```

2. **Start development**:
   ```bash
   ./start-local-dev.sh
   ```

3. **Open dashboard**:
   ```
   http://localhost:3001
   ```

Look for the floating blue chatbot button on the dashboard!

## 🎮 Example Usage

```
# List organizations
"Show me all organizations"

# List apps for an organization  
"List apps for Dream11"

# Create a new app
"Create a new app called MyApp"

# Check deployment status
"What's the status of MyApp deployments?"

# Update a release
"Update the release for MyApp staging to 50% rollout"
```

## 🔧 Configuration

### Environment Variables

Add to `web/.env`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
MCP_SERVER_URL=http://localhost:3001
DOTA_API_URL=http://localhost:3000
```

Add to `mcp/.env`:
```bash
DOTA_API_URL=http://localhost:3000
MCP_PORT=3001
```

## 🛠️ Development

### Project Structure
```
dota/
├── mcp/                          # MCP Server
│   ├── src/http-server.ts        # HTTP wrapper for web integration
│   └── src/index.ts              # Original MCP server
├── web/                          # Web Dashboard
│   ├── app/components/Chatbot/   # Chatbot components
│   ├── app/routes/api.v1.chatbot.ts # Chatbot API route
│   └── app/routes/dashboard.tsx  # Dashboard with chatbot
└── scripts/                     # Setup scripts
```

### Available MCP Tools

1. **Organization Management**: `list_organizations`, `list_apps`
2. **Application Management**: `create_app`, `get_app`
3. **Deployment Management**: `list_deployments`, `create_deployment`, `get_deployment`, `update_deployment`, `delete_deployment`
4. **Release Management**: `update_release`, `get_release_history`, `promote_release`
5. **Metrics**: `get_deployment_metrics`
6. **Collaboration**: `list_collaborators`, `add_collaborator`, `remove_collaborator`

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Missing**:
   ```bash
   Error: API key not found
   Solution: Set OPENAI_API_KEY environment variable
   ```

2. **MCP Server Not Responding**:
   ```bash
   Error: Connection refused
   Solution: Check MCP server is running on port 3001
   ```

3. **Authentication Failures**:
   ```bash
   Error: Unauthorized  
   Solution: Ensure user is logged in and has valid session
   ```

### Debug Commands

```bash
# Check service health
curl http://localhost:3001/health

# Test MCP tool execution
curl -X POST http://localhost:3001/execute-tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "list_organizations", "parameters": {"authToken": "test"}}'
```

## 📊 Production Deployment

For production deployment on EC2:

1. **Deploy MCP server**:
   ```bash
   cd mcp
   npm install && npm run build
   PM2_HOME=/home/ec2-user/.pm2 pm2 start npm --name "mcp-server" -- start
   ```

2. **Update environment variables**:
   ```bash
   # Production URLs
   DOTA_API_URL=https://your-production-api.com
   MCP_SERVER_URL=https://your-mcp-server.com
   ```

3. **Configure load balancer**:
   - Route `/api/v1/chatbot` to web server
   - Route `/mcp/*` to MCP server

## 🔒 Security

- **Session-based authentication**: Uses existing web app authentication
- **Token validation**: All MCP calls include auth tokens
- **CORS protection**: Configured for specific domains
- **Input validation**: Validates all user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Chatting! 🤖✨** 
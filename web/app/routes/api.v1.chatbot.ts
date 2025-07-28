import { json } from "@remix-run/node";
import { OpenAI } from "openai";
import axios from "axios";
import { authenticateActionRequest, AuthenticatedActionFunction } from "~/utils/authenticate";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3001";
const DEV_TOKEN = process.env.token_env || "mock-google-token";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  context?: {
    tenant?: string;
    appName?: string;
    deployment?: string;
  };
  history?: Array<{
    type: "user" | "assistant";
    content: string;
  }>;
}

// System prompt for the Dota management assistant
const SYSTEM_PROMPT = `You are a Dota (Over-The-Air) management assistant that helps users manage their applications, deployments, and releases.

When users ask about organizations, apps, deployments, or other resources, ALWAYS use the appropriate tool to fetch the information. Do not make up responses.

Available tools and their usage:
- list_organizations: Use this when users ask about organizations/tenants they have access to
- list_apps: Use this when users ask about applications in an organization
- create_app: Use this to create a new application
- get_app: Use this to get details about a specific application
- list_deployments: Use this to list deployments for an app
- create_deployment: Use this to create a new deployment
- get_deployment: Use this to get deployment details
- update_deployment: Use this to update deployment settings
- delete_deployment: Use this to remove a deployment
- update_release: Use this to update release information
- get_release_history: Use this to view release history
- promote_release: Use this to promote a release between deployments
- get_deployment_metrics: Use this to get deployment metrics
- list_collaborators: Use this to list app collaborators
- add_collaborator: Use this to add a collaborator
- remove_collaborator: Use this to remove a collaborator

For example:
- When asked "list all organizations" or similar, use the list_organizations tool
- When asked about apps, use list_apps tool
- Always use tools instead of making up responses`;

const chatbot: AuthenticatedActionFunction = async ({ user, request }) => {
  try {
    const body = await request.json() as ChatRequest;
    const { message, context = {}, history = [] } = body;

    // ---------------------------
    // Quick static replies (FAQ)
    // ---------------------------
    const staticReplies: Array<{ pattern: RegExp; answer: string }> = [
      { pattern: /app version.*code ?push/i, answer: "In a CodePush update the native app version (e.g. 5.41.1) doesn't change; instead look at the CodePush label (v1, v3, etc.) to verify the patch." },
      { pattern: /codepush .*adoption.*edge cases/i, answer: "Occasionally React-Native's instance manager can't apply a patch and the app rolls back to the bundled version. This is usually <5 % of devices." },
      { pattern: /how .*send .*dota/i, answer: "OTA works linearly – we keep at most two live versions. To publish a new patch we either finish or halt the current rollout, then push the next one." },
    ];

    for (const s of staticReplies) {
      if (s.pattern.test(message)) {
        return json({ response: s.answer });
      }
    }

    if (!message) {
      return json({ error: "Message is required" }, { status: 400 });
    }

    // Prepare conversation history for OpenAI
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add recent conversation history (limit to last 5 messages)
    history.slice(-5).forEach(msg => {
      messages.push({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // Add current user message with context
    const userMessage = context.tenant ? 
      `[Tenant: ${context.tenant}] ${message}` : message;
    messages.push({ role: "user", content: userMessage });

    // Get OpenAI response
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages,
        temperature: 0.7,
        max_tokens: 500,
        function_call: { name: "execute_mcp_tool" }, // Force function calling
        functions: [
          {
            name: "execute_mcp_tool",
            description: "Execute a Dota management tool",
            parameters: {
              type: "object",
              properties: {
                tool: {
                  type: "string",
                  enum: [
                    "list_organizations", "list_apps", "create_app", "get_app",
                    "list_deployments", "create_deployment", "get_deployment",
                    "update_deployment", "delete_deployment", "update_release",
                    "get_release_history", "promote_release", "get_deployment_metrics",
                    "list_collaborators", "add_collaborator", "remove_collaborator",
                    "increase_rollout", "get_current_rollout", "latest_release_label",
                    "latest_codepushes", "rollout_for_release"
                  ],
                  description: "The tool to execute"
                },
                parameters: {
                  type: "object",
                  properties: {},
                  description: "Parameters for the tool"
                }
              },
              required: ["tool"]
            }
          }
        ]
      });

      const assistantMessage = completion.choices[0].message;

      // Check if OpenAI wants to call a function
      if (assistantMessage.function_call) {
        try {
          const functionName = assistantMessage.function_call.name;
          const functionArgs = JSON.parse(assistantMessage.function_call.arguments || "{}");

          if (functionName === "execute_mcp_tool") {
            try {
              const { tool, parameters: rawParams } = functionArgs;

              // Ensure parameters is always an object to avoid undefined errors
              const parameters: Record<string, any> = typeof rawParams === 'object' && rawParams !== null ? { ...rawParams } : {};

              // --------------------------------------------------
              // Normalize parameter names coming back from OpenAI
              // --------------------------------------------------

              // 1) Organization / tenant mapping
              if (parameters.organization_id || parameters.organizationId) {
                // Always prefer the unique id when provided
                parameters.tenant = parameters.organization_id || parameters.organizationId;
              } else if (!parameters.tenant && parameters.orgId) {
                parameters.tenant = parameters.orgId;
              }
              // Accept organisationId (British spelling) just in case
              if (!parameters.tenant && (parameters.organisationId || parameters.organisation_id)) {
                parameters.tenant = parameters.organisationId || parameters.organisation_id;
              }

              // 2) Human-readable organization name that some prompts return
              if (parameters.organization && !parameters.orgName) {
                parameters.orgName = parameters.organization;
              }

              // 3) App name alias
              if (parameters.app_name && !parameters.name) {
                parameters.name = parameters.app_name;
              }

              // 4) App id alias
              if (parameters.app_id && !parameters.appName) {
                parameters.appName = parameters.app_id;
              }
              // 4b) AppId (camelCase) alias coming from some prompts
              if (parameters.appId && !parameters.appName) {
                parameters.appName = parameters.appId;
              }
              delete parameters.app_id;
              delete parameters.appId;

              // 5) Deployment name/id aliases
              if (!parameters.deploymentName) {
                if (parameters.deployment_id) parameters.deploymentName = parameters.deployment_id;
                else if (parameters.deploymentId) parameters.deploymentName = parameters.deploymentId;
              }
              delete parameters.deployment_id;
              delete parameters.deploymentId;

              // Clean up redundant aliases to avoid MCP validation errors
              delete parameters.organization_id;
              delete parameters.organization;
              delete parameters.app_name;

              // Add auth token to parameters and merge any tenant from the outer context as fallback
              const mcpParameters = {
                ...parameters,
                authToken: DEV_TOKEN,
                ...(context.tenant && { tenant: context.tenant }),
              };

              // If orgName is same as tenant (likely an id) remove it to avoid confusion
              const anyParams = mcpParameters as any;
              if (anyParams.orgName && anyParams.tenant && anyParams.orgName === anyParams.tenant) {
                delete anyParams.orgName;
              }

              console.log('Chatbot context:', context);
              console.log('OpenAI raw parameters:', parameters);
              console.log(`Executing MCP tool: ${tool}`, { parameters: mcpParameters });

              // Call MCP server
              const mcpResponse = await axios.post(`${MCP_SERVER_URL}/execute-tool`, {
                tool,
                parameters: mcpParameters,
              });

              // Format the response data based on the tool
              let formattedResponse = '';
              const data = mcpResponse.data;

              if (tool === 'list_organizations') {
                const orgs = (data.response && data.response.organisations) || [];
                if (orgs.length === 0) {
                  formattedResponse = "You don't have access to any organizations yet.";
                } else {
                  formattedResponse = `Here are the organizations you have access to:\n\n${
                    orgs.map((org: any, index: number) => 
                      `${index + 1}. Organization Name: ${org.displayName}\n   Organization ID: ${org.id}\n   Role: ${org.role}`
                    ).join('\n\n')
                  }\n\nWhich organization would you like to work with?`;
                }
              } else if (tool === 'list_apps') {
                const apps = (data.response && data.response.apps) || [];
                if (apps.length === 0) {
                  formattedResponse = "No applications found in this organization.";
                } else {
                  formattedResponse = `Here are the applications in this organization:\n\n${
                    apps.map((app: any, index: number) => 
                      `${index + 1}. ${app.displayName || app.name} (${app.deployments?.length || 0} deployments)`
                    ).join('\n')
                  }\n\nWhat would you like to do with these applications?`;
                }
              } else if (tool === 'create_app') {
                const app = data.response && data.response.app;
                if (app) {
                  formattedResponse = `✅ Application "${app.name}" created successfully!\n\nDetails:\n- Name: ${app.name}\n- Display Name: ${app.displayName || app.name}\n- Organization: ${app.orgName || 'Default'}\n\nYou can now create deployments for this application.`;
                } else {
                  formattedResponse = "Application created successfully!";
                }
              } else if (tool === 'list_deployments') {
                const deployments = (data.response && (data.response.deployments || data.response)) || data.deployments || [];
                if (deployments.length === 0) {
                  formattedResponse = `No deployments found for ${parameters.appName || 'this app'}.`;
                } else {
                  formattedResponse = `Deployments for ${parameters.appName || 'the app'}:\n\n${deployments.map((d: any, idx: number)=>`${idx+1}. ${d.name}\n   Key: ${d.key}`).join('\n\n')}`;
                }
              } else if (tool === 'create_deployment') {
                const deployment = data.response && data.response.deployment;
                if (deployment) {
                  formattedResponse = `✅ Deployment "${deployment.name}" created successfully!\n\nDetails:\n- Name: ${deployment.name}\n- Key: ${deployment.key}\n\nYou can now release updates to this deployment.`;
                } else {
                  formattedResponse = "Deployment created successfully!";
                }
              } else if (tool === 'get_deployment') {
                const deployment = data.response && data.response.deployment;
                if (deployment) {
                  formattedResponse = `Deployment Details:\n\n- Name: ${deployment.name}\n- Key: ${deployment.key}\n- Current Release: ${deployment.package ? deployment.package.label || 'Latest' : 'None'}\n- Rollout: ${deployment.package ? deployment.package.rollout || 100 : 0}%\n- Status: ${deployment.package && deployment.package.isDisabled ? 'Disabled' : 'Active'}`;
                } else {
                  formattedResponse = "Deployment information retrieved.";
                }
              } else if (tool === 'list_collaborators') {
                const collaborators = (data.response && data.response.collaborators) || {};
                const collabList = Object.entries(collaborators);
                if (collabList.length === 0) {
                  formattedResponse = "No collaborators found for this application.";
                } else {
                  formattedResponse = `Here are the collaborators for this application:\n\n${
                    collabList.map(([email, details]: [string, any], index: number) => 
                      `${index + 1}. ${email}\n   Permission: ${details.permission || 'Collaborator'}\n   Status: ${details.isCurrentAccount ? 'You' : 'Other user'}`
                    ).join('\n\n')
                  }`;
                }
              } else if (tool === 'get_deployment_metrics' || tool === 'get_current_rollout') {
                const metrics = data.response && data.response.metrics;
                if (metrics) {
                  formattedResponse = `Deployment Metrics:\n\n📊 Overview:\n- Total Downloads: ${metrics.totalDownloads || 0}\n- Active Installs: ${metrics.activeInstalls || 0}\n- Failed Installs: ${metrics.failedInstalls || 0}\n- Rollback Rate: ${metrics.rollbackRate || '0%'}\n\n📈 Recent Activity:\n- Last 7 days: ${metrics.weeklyDownloads || 0} downloads\n- Last 30 days: ${metrics.monthlyDownloads || 0} downloads`;
                } else if (data.response?.rollout !== undefined) {
                  formattedResponse = `Current rollout for ${parameters.deploymentName}: ${data.response.rollout}%`;
                } else {
                  formattedResponse = "Metrics data retrieved successfully.";
                }
              } else if (tool === 'increase_rollout') {
                formattedResponse = `✅ Rollout updated to ${parameters.rollout}% successfully! I will monitor the metrics and let you know if we should adjust again.`;
              } else if (tool === 'latest_release_label') {
                if (data.response?.latestRelease) {
                  const lr = data.response.latestRelease;
                  formattedResponse = `The latest CodePush label for ${parameters.deploymentName} is ${lr.label} (released on ${new Date(lr.uploadTime).toLocaleDateString()}).`;
                } else {
                  formattedResponse = 'No releases found.';
                }
              } else if (tool === 'latest_codepushes') {
                const items = data.response?.summaries || [];
                if (!items.length) {
                  formattedResponse = 'No CodePush releases found in the last 7 days.';
                } else {
                  formattedResponse = `CodePush releases from the last ${parameters.days ?? 7} days:\n\n` +
                    items.map((it: any, idx: number) => `${idx + 1}. ${it.appName} – ${it.deployment}\n   Label: ${it.label}\n   Rollout: ${it.rollout}%\n   Time: ${new Date(it.uploadTime).toLocaleString()}\n   ${it.description || ''}`).join('\n\n');
                }
              } else if (tool === 'rollout_for_release') {
                const resArr = data.response?.results || [];
                if (!resArr.length) {
                  formattedResponse = `No deployments found containing version ${parameters.label}.`;
                } else {
                  formattedResponse = `Rollout details for ${parameters.label} (across apps):\n\n` +
                    resArr.map((r: any, i: number) => `${i + 1}. ${r.appName} – ${r.deployment}\n   Label: ${r.label}\n   Rollout: ${r.rollout}%\n   Uploaded: ${new Date(r.uploaded).toLocaleString()}\n   ${r.description || ''}`).join('\n\n');
                }
              } else if (tool === 'add_collaborator') {
                formattedResponse = `✅ Collaborator added successfully!\n\nThe user has been granted access to this application and will receive an email notification.`;
              } else if (tool === 'remove_collaborator') {
                formattedResponse = `✅ Collaborator removed successfully!\n\nThe user no longer has access to this application.`;
              } else if (tool === 'promote_release') {
                formattedResponse = `✅ Release promoted successfully!\n\nThe release has been promoted from the source deployment to the target deployment.`;
              } else if (tool === 'get_release_history') {
                const history = (data.response && data.response.history) || data.history || [];
                if (!history.length) {
                  formattedResponse = `No releases found for ${parameters.deploymentName || 'this deployment'}.`;
                } else {
                  const labelFilter = parameters.label || parameters.releaseLabel;
                  if (labelFilter) {
                    const match = history.find((h: any) => h.label === labelFilter);
                    if (match) {
                      formattedResponse = `Rollout for release ${labelFilter} on ${parameters.deploymentName || 'deployment'} is ${match.rollout || 100}%`;
                    } else {
                      formattedResponse = `Release ${labelFilter} was not found in the history for ${parameters.deploymentName || 'this deployment'}.`;
                    }
                  } else {
                    formattedResponse = `Release history for ${parameters.deploymentName || 'the deployment'} (latest first):\n\n${history.map((h: any, idx: number) => `${idx+1}. ${h.label} - ${h.description || 'No description'}\n   Rollout: ${h.rollout || 100}%`).join('\n\n')}`;
                  }
                }
              } else if (tool === 'update_deployment') {
                formattedResponse = `✅ Deployment updated successfully!\n\nThe deployment settings have been updated with the new configuration.`;
              } else if (tool === 'delete_deployment') {
                formattedResponse = `✅ Deployment deleted successfully!\n\nThe deployment and all its releases have been permanently removed.`;
              } else {
                // For other tools, format the response appropriately
                formattedResponse = `Operation completed successfully. Here's what I found:\n\n${JSON.stringify(data.response, null, 2)}`;
              }

              return json({ response: formattedResponse });
            } catch (error) {
              console.error('Error executing MCP tool:', error);
              const errorMessage = error instanceof Error ? error.message : String(error);
              return json({ 
                response: `I encountered an error while trying to execute that operation: ${errorMessage}. Please try again or contact support if the issue persists.` 
              }, { status: 500 });
            }
          }
        } catch (error) {
          console.error('Error executing MCP tool:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return json({ 
            response: `I encountered an error while trying to execute that operation: ${errorMessage}. Please try again or contact support if the issue persists.` 
          });
        }
      }

      // Return only the assistant's message content
      return json({ response: assistantMessage.content });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return json({ 
        response: `I apologize, but I encountered an error while processing your request: ${errorMessage}. Please try again.` 
      });
    }

  } catch (error) {
    console.error("Chatbot error:", error);
    
    if (error instanceof Error && error.message.includes("API key")) {
      return json({
        response: "I'm currently unable to process your request due to a configuration issue. Please contact your administrator.",
      });
    }
    
    return json({
      response: "I'm sorry, I encountered an unexpected error. Please try again in a moment.",
    });
  }
};

export const action = authenticateActionRequest({
  POST: chatbot,
}); 
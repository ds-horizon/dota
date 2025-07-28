import express from 'express';
import cors from 'cors';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

// Base API URL - can be configured via environment variable
const API_BASE_URL = process.env.DOTA_API_URL || "http://localhost:3000";
const MCP_PORT = process.env.MCP_PORT || 3001;

// Helper function to make API requests with proper error handling
async function makeApiRequest<T>(options: any): Promise<T> {
  try {
    const response = await axios({
      ...options,
      url: `${API_BASE_URL}${options.url}`,
      validateStatus: null
    });

    if (response.status >= 400) {
      console.error(`API Error: ${response.status}`, response.data);
      const err: any = new Error(`API request failed with status ${response.status}`);
      err.status = response.status;
      err.responseData = response.data;
      throw err;
    }

    // Guard: Ensure we received JSON. If not, treat as error (likely unauthenticated redirect).
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      const err: any = new Error('Expected JSON response but received different content-type');
      err.status = response.status;
      err.rawBody = typeof response.data === 'string' ? response.data.slice(0, 500) : response.data;
      throw err;
    }

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Utility to resolve an arbitrary tenant string (id or displayName)
async function resolveTenant(authToken: string, input: string): Promise<{ id: string; displayName: string } | null> {
  try {
    const data = await makeApiRequest<any>({
      method: 'GET',
      url: '/tenants',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const found = (data.organisations || []).find((o: any) =>
      o.id.toLowerCase() === input.toLowerCase() || o.displayName.toLowerCase() === input.toLowerCase()
    );
    return found ? { id: found.id, displayName: found.displayName } : null;
  } catch {
    return null;
  }
}

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint for OpenAI integration
app.post('/chat', async (req, res) => {
  try {
    const { message, authToken, context } = req.body;
    
    if (!message || !authToken) {
      return res.status(400).json({ error: 'Message and authToken are required' });
    }

    // Process the message and determine what MCP tools to call
    const response = await processMessage(message, authToken, context);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MCP tool execution endpoint
app.post('/execute-tool', async (req, res) => {
  try {
    const { tool: toolName, parameters } = req.body;

    if (!toolName) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    // ------------------------------------------------------------------
    // Pre-normalize common aliases so our logs always show canonical keys
    // ------------------------------------------------------------------
    const normalizedParameters = { ...parameters } as any;

    // Common app aliases (app, app_id, appId, app_name)
    if (!normalizedParameters.appName) {
      normalizedParameters.appName = normalizedParameters.app || normalizedParameters.app_id || normalizedParameters.appId || normalizedParameters.app_name;
    }

    // Common deployment aliases
    if (!normalizedParameters.deploymentName) {
      normalizedParameters.deploymentName = normalizedParameters.deployment || normalizedParameters.deployment_id || normalizedParameters.deploymentId || normalizedParameters.deployment_key || normalizedParameters.name;
    }

    console.log(`Executing tool: ${toolName}`, { parameters: normalizedParameters });

    try {
      switch (toolName) {
        case 'list_organizations':
          const orgData = await makeApiRequest<any>({
            method: 'GET',
            url: '/tenants',
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
            },
          });

          console.log('Raw organization data:', orgData);
          return res.json({ response: orgData }); // Return formatted response
        
        case 'list_apps':
          const attemptFetch = async (tenantId: string) => {
            return await makeApiRequest<AppData>({
              method: 'GET',
              url: `/apps`,
              headers: {
                'Authorization': `Bearer ${parameters.authToken}`,
                'tenant': tenantId,
              },
            });
          };

          const userInputName = (parameters.tenant as string | undefined) || '';

          // Resolve tenant immediately
          let tenantId: string = userInputName;
          let resolvedOrgName: string | undefined = undefined;

          const tenantInfo = await resolveTenant(parameters.authToken, userInputName);
          if (tenantInfo) {
            tenantId = tenantInfo.id;
            resolvedOrgName = tenantInfo.displayName;
          }
          let appsData: AppData;
          try {
            appsData = await attemptFetch(tenantId);
          } catch (err: any) {
            // If still getting 404, attempt opposite mapping (id<->displayName)
            if (err?.message?.includes('404')) {
              const tenantInfoFallback = await resolveTenant(parameters.authToken, tenantId);
              if (tenantInfoFallback && tenantInfoFallback.id !== tenantId) {
                tenantId = tenantInfoFallback.id;
                resolvedOrgName = tenantInfoFallback.displayName;
                appsData = await attemptFetch(tenantId);
              } else {
                throw err;
              }
            } else {
              throw err;
            }
          }

          // Log the resolved parameters so the client can see correct mapping
          const execParamsForLog = {
            authToken: parameters.authToken,
            tenant: tenantId,
            ...(resolvedOrgName && { orgName: resolvedOrgName }),
          };
          console.log('Resolved list_apps parameters', execParamsForLog);

          return res.json({
            response: {
              tenant: tenantId,
              orgName: resolvedOrgName || userInputName,
              apps: (appsData.apps || []).map((app) => ({
                name: app.name,
                displayName: app.displayName || app.name,
                deployments: app.deployments || [],
                deploymentCount: app.deployments?.length || 0,
              }))
            }
          });
        
        case 'create_app':
          const createAppData = await makeApiRequest({
            method: 'POST',
            url: `/apps`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
            },
            data: {
              name: parameters.name,
              organisation: parameters.orgId ? { orgId: parameters.orgId } : { orgName: parameters.orgName },
              displayName: parameters.displayName,
            },
          });
          return res.json({ response: createAppData });
        
        case 'list_deployments':
          // Normalize possible app name keys (appName, app_id, appId, app_name)
          const rawAppNameLd = parameters.appName || parameters.app_id || parameters.appId || parameters.app_name || parameters.app;
          if (!rawAppNameLd) {
            return res.status(400).json({ error: 'Missing appName parameter' });
          }
          parameters.appName = rawAppNameLd; // unify for downstream usage

          let depTenant = parameters.tenant as string | undefined;
          if (depTenant) {
            const tInfo = await resolveTenant(parameters.authToken, depTenant);
            if (tInfo) depTenant = tInfo.id;
          }
          // reflect resolved tenant back to parameters for logging consistency
          parameters.tenant = depTenant;

          const deploymentsData = await makeApiRequest({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(depTenant && { 'tenant': depTenant }),
            },
          });

          return res.json({ response: deploymentsData });
        
        case 'create_deployment':
          const createDeploymentData = await makeApiRequest({
            method: 'POST',
            url: `/api/v1/${parameters.appName}/deployments`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
            data: {
              name: parameters.name,
              key: parameters.key,
            },
          });
          return res.json({ response: createDeploymentData });
        
        case 'get_deployment':
          const getDeploymentData = await makeApiRequest({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          return res.json({ response: getDeploymentData });
        
        case 'update_deployment':
          const updateDeploymentData = await makeApiRequest({
            method: 'PATCH',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
            data: {
              label: parameters.label,
              rollout: parameters.rollout,
              ...(parameters.isDisabled !== undefined && { isDisabled: parameters.isDisabled }),
              ...(parameters.isMandatory !== undefined && { isMandatory: parameters.isMandatory }),
            },
          });
          return res.json({ response: updateDeploymentData });
        
        case 'delete_deployment':
          const deleteDeploymentData = await makeApiRequest({
            method: 'DELETE',
            url: `/apps/${parameters.appName}/deployments`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              'deploymentName': parameters.deploymentName,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          return res.json({ response: deleteDeploymentData });
        
        case 'get_release_history':
          // Normalize app name keys
          const rawAppNameRH = parameters.appName || parameters.app || parameters.app_id || parameters.appId || parameters.app_name;
          if (!rawAppNameRH) {
            return res.status(400).json({ error: 'Missing appName parameter' });
          }
          parameters.appName = rawAppNameRH;

          // Normalize deployment name keys
          const rawDepNameRH = parameters.deploymentName || parameters.deployment_key || parameters.deploymentId || parameters.deployment_id || parameters.deployment || parameters.name;
          if (!rawDepNameRH) {
            return res.status(400).json({ error: 'Missing deploymentName parameter' });
          }
          parameters.deploymentName = rawDepNameRH;

          // Resolve tenant id and determine orgName for clearer logging
          let histTenant: string | undefined = parameters.tenant as string | undefined;
          let resolvedOrgNameRH: string | undefined = undefined;

          if (histTenant) {
            const tInfo = await resolveTenant(parameters.authToken, histTenant);
            if (tInfo) {
              resolvedOrgNameRH = tInfo.displayName;
              histTenant = tInfo.id;
            }
          } else if (parameters.orgName) {
            // If orgName provided but tenant missing, attempt resolution
            const tInfo = await resolveTenant(parameters.authToken, parameters.orgName);
            if (tInfo) {
              resolvedOrgNameRH = tInfo.displayName;
              histTenant = tInfo.id;
            }
          }

          parameters.tenant = histTenant; // canonical id
          if (resolvedOrgNameRH) {
            parameters.orgName = resolvedOrgNameRH;
          }

          // Log the resolved mapping for easier debugging
          console.log('Resolved get_release_history parameters', {
            authToken: parameters.authToken,
            tenant: histTenant,
            ...(resolvedOrgNameRH && { orgName: resolvedOrgNameRH }),
            appName: parameters.appName,
            deploymentName: parameters.deploymentName,
          });

          let releaseHistoryData;
          try {
            releaseHistoryData = await makeApiRequest({
              method: 'GET',
              url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}/history`,
              headers: {
                'Authorization': `Bearer ${parameters.authToken}`,
                ...(histTenant && { 'tenant': histTenant }),
              },
            });
          } catch (err: any) {
            // Gracefully handle no history (404 Not Found)
            if (err.status === 404) {
              return res.json({ response: { history: [] } });
            }
            throw err;
          }

          return res.json({ response: releaseHistoryData });
        
        case 'promote_release':
          const promoteReleaseData = await makeApiRequest({
            method: 'POST',
            url: `/apps/${parameters.appName}/deployments/${parameters.sourceDeployment}/promote/${parameters.targetDeployment}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
            data: {
              appId: parameters.appName,
              sourceDeployment: parameters.sourceDeployment,
              targetDeployment: parameters.targetDeployment,
              label: parameters.label,
            },
          });
          return res.json({ response: promoteReleaseData });
        
        case 'get_deployment_metrics':
          const metricsData = await makeApiRequest({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}/metrics`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          return res.json({ response: metricsData });
        
        case 'list_collaborators':
          const collaboratorsData = await makeApiRequest({
            method: 'GET',
            url: `/api/v1/${parameters.appName}/collaborators`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          return res.json({ response: collaboratorsData });
        
        case 'add_collaborator':
          const addCollaboratorData = await makeApiRequest({
            method: 'POST',
            url: `/api/v1/${parameters.appName}/collaborators`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
            data: {
              email: parameters.email,
              permission: parameters.permission,
            },
          });
          return res.json({ response: addCollaboratorData });
        
        case 'remove_collaborator':
          const removeCollaboratorData = await makeApiRequest({
            method: 'DELETE',
            url: `/api/v1/${parameters.appName}/collaborators/${parameters.email}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          return res.json({ response: removeCollaboratorData });
        
        case 'get_app':
          {
            // Need tenant id to fetch apps list first
            let gaTenant = parameters.tenant as string | undefined;
            if (gaTenant) {
              const tInfo = await resolveTenant(parameters.authToken, gaTenant);
              if (tInfo) gaTenant = tInfo.id;
            } else if (parameters.orgId) {
              gaTenant = parameters.orgId;
            }

            const appsResp = await makeApiRequest<AppData>({
              method: 'GET',
              url: `/apps`,
              headers: {
                'Authorization': `Bearer ${parameters.authToken}`,
                ...(gaTenant && { 'tenant': gaTenant }),
              },
            });

            const found = (appsResp.apps || []).find((a) => a.name === parameters.appName);
            if (!found) {
              return res.status(404).json({ error: `App "${parameters.appName}" not found` });
            }

            return res.json({ response: { app: found } });
          }
        
        case 'increase_rollout':
          // Alias for update_deployment but expects 'rollout' percentage only
          // Required parameters: appName, deploymentName, rollout (number 0-100)
          if (typeof parameters.rollout !== 'number') {
            return res.status(400).json({ error: 'Missing rollout parameter (number)' });
          }
          const incRolloutData = await makeApiRequest({
            method: 'PATCH',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
            data: {
              rollout: parameters.rollout,
            },
          });
          return res.json({ response: incRolloutData });

        case 'get_current_rollout':
          // Fetch deployment and extract rollout
          const depInfo = await makeApiRequest<any>({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          const rolloutPct = depInfo?.package?.rollout ?? 100;
          return res.json({ response: { rollout: rolloutPct, deployment: depInfo } });

        case 'latest_release_label':
          // Return most recent release label for a deployment
          const relHist = await makeApiRequest<any>({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}/history`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });
          const latest = Array.isArray(relHist?.history) ? relHist.history[0] : undefined;
          return res.json({ response: { latestRelease: latest } });
        
        case 'latest_codepushes':
          // Summarise latest releases across all apps within the given period (default 7 days)
          const lookbackDays = parameters.days ?? 7;
          const sinceDate = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;

          // Step 1: list apps (optionally within tenant)
          const appsResp = await makeApiRequest<AppData>({
            method: 'GET',
            url: '/apps',
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });

          const summaries: any[] = [];

          const appsArr = appsResp.apps || [];
          for (const app of appsArr) {
            const deployments = app.deployments || [];
            for (const dep of deployments) {
              try {
                const hist = await makeApiRequest<{ history: any[] }>({
                  method: 'GET',
                  url: `/apps/${app.name}/deployments/${dep.name}/history`,
                  headers: {
                    'Authorization': `Bearer ${parameters.authToken}`,
                    ...(parameters.tenant && { 'tenant': parameters.tenant }),
                  },
                });

                const latestRelease = hist.history?.[0];
                if (latestRelease && new Date(latestRelease.uploadTime).getTime() >= sinceDate) {
                  summaries.push({
                    appName: app.name,
                    deployment: dep.name,
                    label: latestRelease.label,
                    description: latestRelease.description,
                    rollout: latestRelease.rollout ?? 100,
                    uploadTime: latestRelease.uploadTime,
                  });
                }
              } catch (err: any) {
                console.warn('Failed to fetch history for', app.name, dep.name, err?.message);
              }
            }
          }

          // Sort by time desc
          summaries.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());

          return res.json({ response: { summaries } });
        
        case 'rollout_for_release':
          // Parameters: label (string), optional tenant
          // Accept multiple aliases for the desired version string
          const releaseLabel = parameters.label || parameters.releaseVersion || parameters.version || parameters.appVersion;
          if (!releaseLabel) {
            return res.status(400).json({ error: 'Missing label parameter' });
          }
          const safeRegex = new RegExp(releaseLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          const appsDataRr = await makeApiRequest<AppData>({
            method: 'GET',
            url: '/apps',
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(parameters.tenant && { 'tenant': parameters.tenant }),
            },
          });

          const results: any[] = [];
          for (const app of appsDataRr.apps || []) {
            let deploymentList = app.deployments || [];
            if (!deploymentList.length || deploymentList.some((d: any)=> !d?.name)) {
              // Fetch deployments for app if not present or malformed
              try {
                const depsResp = await makeApiRequest<any>({
                  method: 'GET',
                  url: `/apps/${app.name}/deployments`,
                  headers: {
                    'Authorization': `Bearer ${parameters.authToken}`,
                    ...(parameters.tenant && { 'tenant': parameters.tenant }),
                  },
                });
                deploymentList = depsResp.deployments || depsResp || [];
              } catch (e) {
                console.warn('Failed to list deployments for', app.name);
              }
            }

            for (const dep of deploymentList) {
              try {
                const hist = await makeApiRequest<{ history: any[] }>({
                  method: 'GET',
                  url: `/apps/${app.name}/deployments/${dep.name}/history`,
                  headers: {
                    'Authorization': `Bearer ${parameters.authToken}`,
                    ...(parameters.tenant && { 'tenant': parameters.tenant }),
                  },
                });
                const match = (hist.history || []).find((h: any) => safeRegex.test(h.label) || safeRegex.test(h.appVersion || '') || safeRegex.test(h.description || ''));
                if (match) {
                  results.push({
                    appName: app.name,
                    deployment: dep.name,
                    label: match.label,
                    rollout: match.rollout ?? 100,
                    description: match.description,
                    uploaded: match.uploadTime,
                  });
                }
              } catch (err: any) {
                console.warn('history fetch failed', app.name, dep.name, err?.message);
              }
            }
          }

          return res.json({ response: { results } });
        
        default:
          return res.status(400).json({ error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      console.error(`Tool execution error: ${toolName}`, error);
      return res.status(500).json({ 
        error: 'Tool execution failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// List available tools
app.get('/tools', (req, res) => {
  const tools = [
    { name: 'list_organizations', description: 'List all organizations/tenants' },
    { name: 'list_apps', description: 'List applications for specific organization' },
    { name: 'create_app', description: 'Create new applications' },
    { name: 'get_app', description: 'Get application details' },
    { name: 'list_deployments', description: 'List deployments for applications' },
    { name: 'create_deployment', description: 'Create new deployments' },
    { name: 'get_deployment', description: 'Get deployment details' },
    { name: 'update_deployment', description: 'Update deployment metadata' },
    { name: 'delete_deployment', description: 'Delete deployments' },
    { name: 'update_release', description: 'Update release metadata' },
    { name: 'get_release_history', description: 'Get release history' },
    { name: 'promote_release', description: 'Promote releases between deployments' },
    { name: 'get_deployment_metrics', description: 'Get deployment metrics' },
    { name: 'list_collaborators', description: 'List app collaborators' },
    { name: 'add_collaborator', description: 'Add collaborators to apps' },
    { name: 'remove_collaborator', description: 'Remove collaborators from apps' },
  ];
  
  res.json({ tools });
});

interface OrgData {
  tenants: Array<{
    id: string;
    name: string;
    displayName?: string;
  }>;
}

interface AppData {
  apps: Array<{
    name: string;
    displayName?: string;
    deployments?: any[];
  }>;
}

// Simple message processing function
async function processMessage(message: string, authToken: string, context: any = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based routing - in production, you'd use OpenAI for better intent recognition
  if (lowerMessage.includes('list') && lowerMessage.includes('app')) {
    if (context.tenant) {
      return await executeMcpTool('list_apps', { authToken, tenant: context.tenant });
    } else {
      return "Please specify which organization/tenant you'd like to list apps for.";
    }
  }
  
  if (lowerMessage.includes('create') && lowerMessage.includes('app')) {
    return "To create an app, please specify the app name and organization.";
  }
  
  if (lowerMessage.includes('deployment')) {
    return "I can help you manage deployments. Please specify the app name and what you'd like to do.";
  }
  
  if (lowerMessage.includes('release')) {
    return "I can help you manage releases. Please specify the app name, deployment, and what you'd like to do.";
  }
  
  if (lowerMessage.includes('organization') || lowerMessage.includes('org')) {
    return await executeMcpTool('list_organizations', { authToken });
  }
  
  return "I can help you manage your Dota applications, deployments, and releases. What would you like to do?";
}

// Execute MCP tool
async function executeMcpTool(toolName: string, parameters: any) {
  try {
    switch (toolName) {
      case 'list_organizations':
        try {
          const orgData = await makeApiRequest<any>({
            method: 'GET',
            url: '/tenants',
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
            },
          });

          console.log('Raw organization data:', orgData);
          return orgData; // Return the raw response
        } catch (error) {
          console.error('Error fetching organizations:', error);
          throw error;
        }
      
      case 'list_apps':
        const attemptFetch = async (tenantId: string) => {
          return await makeApiRequest<AppData>({
            method: 'GET',
            url: `/apps`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              'tenant': tenantId,
            },
          });
        };

        const userInputName = (parameters.tenant as string | undefined) || '';

        // Resolve tenant immediately
        let tenantId: string = userInputName;
        let resolvedOrgName: string | undefined = undefined;

        const tenantInfo = await resolveTenant(parameters.authToken, userInputName);
        if (tenantInfo) {
          tenantId = tenantInfo.id;
          resolvedOrgName = tenantInfo.displayName;
        }
        let appsData: AppData;
        try {
          appsData = await attemptFetch(tenantId);
        } catch (err: any) {
          // If still getting 404, attempt opposite mapping (id<->displayName)
          if (err?.message?.includes('404')) {
            const tenantInfoFallback = await resolveTenant(parameters.authToken, tenantId);
            if (tenantInfoFallback && tenantInfoFallback.id !== tenantId) {
              tenantId = tenantInfoFallback.id;
              resolvedOrgName = tenantInfoFallback.displayName;
              appsData = await attemptFetch(tenantId);
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        }

        // Log the resolved parameters so the client can see correct mapping
        const execParamsForLog = {
          authToken: parameters.authToken,
          tenant: tenantId,
          ...(resolvedOrgName && { orgName: resolvedOrgName }),
        };
        console.log('Resolved list_apps parameters', execParamsForLog);

        return {
          apps: (appsData.apps || []).map((app) => ({
            name: app.name,
            displayName: app.displayName || app.name,
            deployments: app.deployments || [],
            deploymentCount: app.deployments?.length || 0,
          }))
        };
      
      case 'create_app':
        return await makeApiRequest({
          method: 'POST',
          url: `/apps`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
          },
          data: {
            name: parameters.name,
            organisation: parameters.orgId ? { orgId: parameters.orgId } : { orgName: parameters.orgName },
            displayName: parameters.displayName,
          },
        });
      
      case 'list_deployments':
        // Normalize possible app name keys (appName, app_id, appId, app_name)
        const rawAppNameLd2 = parameters.appName || parameters.app_id || parameters.appId || parameters.app_name || parameters.app;
        if (!rawAppNameLd2) {
          throw new Error('Missing appName parameter');
        }
        parameters.appName = rawAppNameLd2; // unify for downstream

        let depTenant = parameters.tenant as string | undefined;
        if (depTenant) {
          const tInfo = await resolveTenant(parameters.authToken, depTenant);
          if (tInfo) depTenant = tInfo.id;
        }
        // reflect resolved tenant back to parameters for logging consistency
        parameters.tenant = depTenant;

        const deploymentsData = await makeApiRequest({
          method: 'GET',
          url: `/apps/${parameters.appName}/deployments`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(depTenant && { 'tenant': depTenant }),
          },
        });

        return deploymentsData;
      
      case 'create_deployment':
        return await makeApiRequest({
          method: 'POST',
          url: `/api/v1/${parameters.appName}/deployments`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
          data: {
            name: parameters.name,
            key: parameters.key,
          },
        });
      
      case 'get_deployment':
        return await makeApiRequest({
          method: 'GET',
          url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
        });
      
      case 'update_deployment':
        return await makeApiRequest({
          method: 'PATCH',
          url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
          data: {
            label: parameters.label,
            rollout: parameters.rollout,
            ...(parameters.isDisabled !== undefined && { isDisabled: parameters.isDisabled }),
            ...(parameters.isMandatory !== undefined && { isMandatory: parameters.isMandatory }),
          },
        });
      
      case 'delete_deployment':
        return await makeApiRequest({
          method: 'DELETE',
          url: `/apps/${parameters.appName}/deployments`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            'deploymentName': parameters.deploymentName,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
        });
      
      case 'get_release_history':
        // Normalize deployment name keys
        const rawDepNameRH2 = parameters.deploymentName || parameters.deployment_key || parameters.deploymentId || parameters.deployment_id || parameters.deployment || parameters.name;
        if (!rawDepNameRH2) {
          throw new Error('Missing deploymentName parameter');
        }
        parameters.deploymentName = rawDepNameRH2;

        let histTenant2 = parameters.tenant as string | undefined;
        if (histTenant2) {
          const tInfo = await resolveTenant(parameters.authToken, histTenant2);
          if (tInfo) histTenant2 = tInfo.id;
        }
        parameters.tenant = histTenant2;

        try {
          return await makeApiRequest({
            method: 'GET',
            url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}/history`,
            headers: {
              'Authorization': `Bearer ${parameters.authToken}`,
              ...(histTenant2 && { 'tenant': histTenant2 }),
            },
          });
        } catch (err: any) {
          if (err.status === 404) {
            return { history: [] };
          }
          throw err;
        }
      
      case 'promote_release':
        return await makeApiRequest({
          method: 'POST',
          url: `/apps/${parameters.appName}/deployments/${parameters.sourceDeployment}/promote/${parameters.targetDeployment}`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
          data: {
            appId: parameters.appName,
            sourceDeployment: parameters.sourceDeployment,
            targetDeployment: parameters.targetDeployment,
            label: parameters.label,
          },
        });
      
      case 'get_deployment_metrics':
        return await makeApiRequest({
          method: 'GET',
          url: `/apps/${parameters.appName}/deployments/${parameters.deploymentName}/metrics`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
        });
      
      case 'list_collaborators':
        return await makeApiRequest({
          method: 'GET',
          url: `/api/v1/${parameters.appName}/collaborators`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
        });
      
      case 'add_collaborator':
        return await makeApiRequest({
          method: 'POST',
          url: `/api/v1/${parameters.appName}/collaborators`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
          data: {
            email: parameters.email,
            permission: parameters.permission,
          },
        });
      
      case 'remove_collaborator':
        return await makeApiRequest({
          method: 'DELETE',
          url: `/api/v1/${parameters.appName}/collaborators/${parameters.email}`,
          headers: {
            'Authorization': `Bearer ${parameters.authToken}`,
            ...(parameters.tenant && { 'tenant': parameters.tenant }),
          },
        });
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    throw error;
  }
}

// Start the server
app.listen(MCP_PORT, () => {
  console.log(`MCP HTTP Server running on port ${MCP_PORT}`);
  console.log(`API Base URL: ${API_BASE_URL}`);
});

export default app; 
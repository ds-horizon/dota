export default function WebDashboard() {
  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>Web Dashboard</span>
        <span className="mx-2">/</span>
        <span>Dashboard</span>
      </div>

      <div className="flex flex-col">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6">Web Dashboard</h1>

          <div className="mb-8">
            <p className="mb-4">
              The DOTA Web Dashboard is a comprehensive management interface for DOTA (Distributed Over-The-Air Updates), 
              built with Remix and React. It provides a user-friendly interface for managing organizations, applications, 
              deployments, and access control.
            </p>
          </div>

          {/* -------------------------------------------------------------
              FEATURES OVERVIEW
          ------------------------------------------------------------- */}
          <div className="mb-8" id="features-overview">
            <h2 className="text-2xl font-bold mb-4">Features Overview</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">🔐 Authentication</h3>
                <ul className="list-disc pl-6">
                  <li>Google OAuth integration</li>
                  <li>Secure session management</li>
                  <li>Role-based access control</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">🏢 Organization Management</h3>
                <ul className="list-disc pl-6">
                  <li>Create and manage organizations</li>
                  <li>Organization-specific settings</li>
                  <li>Team collaboration features</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">📱 Application Management</h3>
                <ul className="list-disc pl-6">
                  <li>Create and manage applications</li>
                  <li>View application details and metrics</li>
                  <li>Manage app deployments</li>
                  <li>Handle app collaborators</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">🚀 Deployment Features</h3>
                <ul className="list-disc pl-6">
                  <li>Create and manage deployments</li>
                  <li>Promote deployments between environments</li>
                  <li>Manage deployment tokens</li>
                  <li>View deployment history and status</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">🔌 API Integration</h3>
                <ul className="list-disc pl-6">
                  <li>RESTful API endpoints</li>
                  <li>Access key management</li>
                  <li>Tenant management</li>
                  <li>Deployment management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              APP MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="app-management">
            <h2 className="text-2xl font-bold mb-4">App Management</h2>
            <p className="mb-4">
              The app management section allows you to create and manage applications for your organization. 
              Before you can deploy any updates, you need to register an app with the DOTA service.
            </p>
            <p className="mb-4">
              All new apps automatically come with two deployments (Staging and Production).
            </p>

            <div className="alert-note mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="alert-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  If your app targets both iOS and Android, please create separate apps for each
                  platform with DOTA (e.g., MyApp-iOS and MyApp-Android).
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              ORGANIZATION MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="organization-management">
            <h2 className="text-2xl font-bold mb-4">Organization Management</h2>
            <p className="mb-4">
              The organization management section allows you to create and manage organizations. 
              Organizations provide a way to group apps and collaborators for team-based workflows.
            </p>
            <p className="mb-4">
              You can view all organizations associated with your account, manage organization settings,
              and control access to organization resources.
            </p>
          </div>

          {/* -------------------------------------------------------------
              COLLABORATOR MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="collaborator-management">
            <h2 className="text-2xl font-bold mb-4">Collaborator Management</h2>
            <p className="mb-4">
              DOTA allows you to add collaborators to your app, enabling other developers to deploy
              updates to your app's deployments. The collaborator management interface provides:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Adding new collaborators via email</li>
              <li>Removing collaborators from your app</li>
              <li>Viewing and managing all collaborators for your app</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              ACCESS KEY MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="access-key-management">
            <h2 className="text-2xl font-bold mb-4">Access Key Management</h2>
            <p className="mb-4">
              Access keys enable you to authenticate with the DOTA service without needing to use
              your Google credentials. The dashboard provides interfaces for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Creating new access keys with optional time-to-live (TTL) values</li>
              <li>Updating existing access keys</li>
              <li>Removing access keys that are no longer needed</li>
              <li>Viewing all access keys associated with your account</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              SESSION MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="session-management">
            <h2 className="text-2xl font-bold mb-4">Session Management</h2>
            <p className="mb-4">
              The session management interface allows you to view and manage your current login sessions.
              You can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>View all active sessions across different devices</li>
              <li>Remove sessions for specific devices</li>
              <li>Monitor when and where your account is being accessed</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              DEPLOYMENT MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="deployment-management">
            <h2 className="text-2xl font-bold mb-4">Deployment Management</h2>
            <p className="mb-4">
              From the DOTA perspective, an app is simply a named grouping for one or more
              "deployments." While the app represents a conceptual "namespace," its deployments 
              represent the actual targets for releasing updates (for developers) and synchronizing 
              updates (for end-users).
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Default Deployments</h3>
              <p className="mb-4">
                Each app will have two deployments created by default: <strong>Production</strong> and <strong>Staging</strong>. 
                These deployments are ready to use immediately after app creation.
              </p>
              <figure className="mb-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300 italic text-sm text-center">Image: Default deployments (Production and Staging) shown in the deployment search dialog</p>
                </div>
              </figure>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Deployment Actions</h3>
              <p className="mb-4">
                The dashboard provides several ways to manage your deployments:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Create</strong> - Add new deployment environments beyond the default ones</li>
                <li><strong>Search</strong> - Find specific deployments from the dropdown menu</li>
                <li><strong>Delete</strong> - Remove deployments that are no longer needed</li>
              </ul>
              <figure className="mb-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300 italic text-sm text-center">Image: Deployment management dropdown showing Create, Search, and Delete options</p>
                </div>
              </figure>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Copying Deployment Keys</h3>
              <p className="mb-4">
                Deployment keys are required when configuring your mobile app to receive updates from DOTA. 
                You can easily copy any deployment key directly from the dashboard using the "Copy Deployment Key" button.
              </p>
              <figure className="mb-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300 italic text-sm text-center">Image: Copy Deployment Key button with the deployment key</p>
                </div>
              </figure>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Deployment Management Table</h3>
              <p className="mb-4">
                The deployments table shows key information about each deployment, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Label - The release identifier</li>
                <li>Target Versions - The app versions this update applies to</li>
                <li>Status - Current state of the deployment</li>
                <li>Mandatory - Whether the update is required</li>
                <li>Rollbacks - Number of automatic rollbacks</li>
                <li>Active Devices - Number of devices using this version</li>
                <li>Rollout - Percentage of users receiving this update</li>
                <li>Released At - Timestamp of the release</li>
              </ul>
              <figure className="mb-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300 italic text-sm text-center">Image: Deployment management table</p>
                </div>
              </figure>
            </div>

            <div className="alert-note mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="alert-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  Installation metrics are displayed in the deployment view, showing active users, 
                  total installations, pending updates, rollbacks, and more.
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RELEASING UPDATES
          ------------------------------------------------------------- */}
          <div className="mb-8" id="releasing-updates">
            <h2 className="text-2xl font-bold mb-4">Releasing Updates</h2>
            <p className="mb-4">
              The dashboard provides a user-friendly interface for releasing updates to your apps.
              You can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Upload update packages</li>
              <li>Specify target binary versions</li>
              <li>Set update descriptions (changelog)</li>
              <li>Configure mandatory updates</li>
              <li>Control rollout percentages</li>
              <li>Enable/disable specific releases</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              PATCHING UPDATE METADATA
          ------------------------------------------------------------- */}
          <div className="mb-8" id="patching-update-metadata">
            <h2 className="text-2xl font-bold mb-4">Patching Update Metadata</h2>
            <p className="mb-4">
              After releasing an update, there may be scenarios where you need to modify one or more
              of the metadata attributes. The dashboard allows you to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mark an update as mandatory</li>
              <li>Change the rollout percentage</li>
              <li>Enable or disable specific releases</li>
              <li>Update the release description</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              PROMOTING UPDATES
          ------------------------------------------------------------- */}
          <div className="mb-8" id="promoting-updates">
            <h2 className="text-2xl font-bold mb-4">Promoting Updates</h2>
            <p className="mb-4">
              Once you've tested an update in a specific deployment (e.g., Staging), you can promote it
              "downstream" (e.g., Production) using the dashboard. This creates a new release for the
              destination deployment with the same code and metadata from the source deployment's
              latest release.
            </p>
            <p className="mb-4">
              When promoting an update, you can override certain properties like description, rollout 
              percentage, and whether the update is mandatory.
            </p>
          </div>

          {/* -------------------------------------------------------------
              ROLLING BACK UPDATES
          ------------------------------------------------------------- */}
          <div className="mb-8" id="rolling-back-updates">
            <h2 className="text-2xl font-bold mb-4">Rolling Back Updates</h2>
            <p className="mb-4">
              If you release an update that is broken or contains unintended features, you can easily
              roll it back using the dashboard. This will:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Disable the current release</li>
              <li>Re-enable the previous working release</li>
              <li>Prevent users from downloading the problematic update</li>
              <li>Optionally target a specific release to roll back to</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              VIEWING RELEASE HISTORY
          ------------------------------------------------------------- */}
          <div className="mb-8" id="viewing-release-history">
            <h2 className="text-2xl font-bold mb-4">Viewing Release History</h2>
            <p className="mb-4">
              The dashboard provides a comprehensive view of release history for each deployment,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Release labels and timestamps</li>
              <li>Mandatory/disabled flags</li>
              <li>Release descriptions</li>
              <li>Author information</li>
              <li>Installation metrics</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              CLEARING RELEASE HISTORY
          ------------------------------------------------------------- */}
          <div className="mb-8" id="clearing-release-history">
            <h2 className="text-2xl font-bold mb-4">Clearing Release History</h2>
            <p className="mb-4">
              You can clear the release history associated with a deployment through the dashboard.
              After clearing the history, client devices configured to use that deployment key will
              no longer receive any of the cleared updates.
            </p>
            <div className="alert-warning mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="alert-icon"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div className="alert-content">
                <strong>Caution:</strong>
                <p>
                  Use this feature with caution as it will affect all users configured to use this
                  deployment.
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              ANALYTICS AND REPORTING
          ------------------------------------------------------------- */}
          <div className="mb-8" id="analytics-and-reporting">
            <h2 className="text-2xl font-bold mb-4">Analytics and Reporting</h2>
            <p className="mb-4">
              The dashboard provides analytics and reporting features to help you understand your
              app's update performance:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Installation success/failure rates</li>
              <li>Active user counts</li>
              <li>Device and OS distribution</li>
              <li>Update adoption rates</li>
              <li>Rollback occurrences and reasons</li>
            </ul>
            <p className="mb-4">
              These analytics can help guide your deployment strategy and identify potential issues
              with specific updates or device types.
            </p>
          </div>

          {/* -------------------------------------------------------------
              API ENDPOINTS
          ------------------------------------------------------------- */}
          <div className="mb-8" id="api-endpoints">
            <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
            <p className="mb-4">
              The dashboard provides the following main API endpoints:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><code>/api/v1/tenants</code> - Tenant management</li>
              <li><code>/api/v1/access-keys</code> - Access key management</li>
              <li><code>/api/v1/:org/apps</code> - Application management</li>
              <li><code>/api/v1/:app/deployments</code> - Deployment management</li>
              <li><code>/api/v1/:app/collaborators</code> - Collaborator management</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              PROJECT STRUCTURE
          ------------------------------------------------------------- */}
          <div className="mb-8" id="project-structure">
            <h2 className="text-2xl font-bold mb-4">Project Structure</h2>
            <p className="mb-4">
              The DOTA Web Dashboard follows this structure:
            </p>
            <pre className="code-block mb-6">
              <code>{`web/
├── app/
│   ├── components/     # Reusable UI components
│   ├── routes/        # Application routes and pages
│   ├── utils/         # Utility functions and helpers
│   ├── assets/        # Static assets
│   └── root.tsx       # Root layout component
├── public/            # Public static files
├── scripts/           # Build and utility scripts
└── server.mjs         # Production server entry`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 
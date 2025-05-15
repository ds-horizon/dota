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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark-mode:bg-gray-800 p-4 rounded-lg dark-mode:text-gray-200">
                <h3 className="text-lg font-semibold mb-2">🔐 Authentication</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Google OAuth integration</li>
                  <li>Secure session management</li>
                  <li>Role-based access control</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark-mode:bg-gray-800 p-4 rounded-lg dark-mode:text-gray-200">
                <h3 className="text-lg font-semibold mb-2">🏢 Organization Management</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Create and manage organizations</li>
                  <li>Organization-specific settings</li>
                  <li>Team collaboration features</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark-mode:bg-gray-800 p-4 rounded-lg dark-mode:text-gray-200">
                <h3 className="text-lg font-semibold mb-2">📱 Application Management</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Create and manage applications</li>
                  <li>View application details and metrics</li>
                  <li>Manage app deployments</li>
                  <li>Handle app collaborators</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark-mode:bg-gray-800 p-4 rounded-lg dark-mode:text-gray-200">
                <h3 className="text-lg font-semibold mb-2">🚀 Deployment Features</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Create and manage deployments</li>
                  <li>Promote deployments between environments</li>
                  <li>Manage deployment tokens</li>
                  <li>View deployment history and status</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark-mode:bg-gray-800 p-4 rounded-lg dark-mode:text-gray-200">
                <h3 className="text-lg font-semibold mb-2">🔌 API Integration</h3>
                <ul className="list-disc pl-5 text-sm">
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

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Creating an App</h3>
              <p className="mb-4">
                To create an app:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Log in to DOTA Dashboard.</li>
                <li>Click the <strong>Add new app</strong> in the upper-right corner of the page (or press the <kbd>C</kbd> key).</li>
                <li>Populate the panel that appears with information about the new app.</li>
              </ol>
              <figure className="mb-4">
                <img src="/src/images/createapp.gif" alt="Creating a new app in DOTA Dashboard" className="rounded-md shadow-md" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Creating a new app in DOTA Dashboard</p>
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
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Accessing Organizations</h3>
              <p className="mb-4">
                All of your organizations are accessible in the left navigation panel of the DOTA Dashboard.
                Organizations are the owners of apps, so when you create an app in a different organization,
                that organization is automatically created if it doesn't already exist.
              </p>
              <figure className="mb-4">
                <img src="/src/images/orgcreate.gif" alt="Creating a new organization in DOTA Dashboard" className="rounded-md shadow-md" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Creating a new organization via app creation</p>
              </figure>
            </div>
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
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Adding Users to an Organization</h3>
              <p className="mb-4">
                You can add users to an organization indirectly through an app. Here's how:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Select an app within an organization</li>
                <li>Click on "Go to app" and select "Collaborators" from the top toggle-tab options</li>
                <li>Select "Add collaborator"</li>
                <li>Type the user's email address to add the user</li>
              </ol>
              <figure className="mb-4">
                <img src="/src/images/addcollab.gif" alt="Adding collaborators to an app in DOTA Dashboard" className="rounded-md shadow-md" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Adding collaborators to an app</p>
              </figure>
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACCESS KEY MANAGEMENT
          ------------------------------------------------------------- */}
          <div className="mb-8" id="access-key-management">
            <h2 className="text-2xl font-bold mb-4">Token Management</h2>
            <p className="mb-4">
              Tokens enable you to authenticate with the DOTA service without needing to use
              your Google credentials. The dashboard provides interfaces for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Creating new tokens</li>
              <li>Removing tokens that are no longer needed</li>
              <li>Viewing all tokens associated with your account</li>
            </ul>
            <figure className="mb-4">
              <img src="/src/images/tokensave.gif" alt="Creating and saving tokens in DOTA Dashboard" className="rounded-md shadow-md" />
              <p className="text-gray-600 italic text-sm text-center mt-2">Creating and saving tokens for authentication</p>
            </figure>
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
                <img src="/src/images/defaultdeployment.png" alt="Default deployments (Production and Staging) shown in the deployment search dialog" className="rounded-md shadow-md border border-gray-200" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Default deployments (Production and Staging) shown in the deployment search dialog</p>
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
              <p className="mb-4">
                You can quickly access deployment actions by pressing <kbd>⌘</kbd>+<kbd>K</kbd> (Command+K) to open the command menu for creating and searching deployments.
              </p>
              <figure className="mb-4 flex flex-col items-center">
                <img src="/src/images/deploymentmanage.png" alt="Deployment management dropdown showing Create, Search, and Delete options" className="rounded-md shadow-md border border-gray-200" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Deployment management dropdown showing Create, Search, and Delete options</p>
              </figure>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Copying Deployment Keys</h3>
              <p className="mb-4">
                Deployment keys are required when configuring your mobile app to receive updates from DOTA. 
                You can easily copy any deployment key directly from the dashboard using the "Copy Deployment Key" button.
              </p>
              <figure className="mb-4">
                <img src="/src/images/copy.png" alt="Copy Deployment Key button with the deployment key" className="rounded-md shadow-md border border-gray-200" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Copy Deployment Key button with the deployment key</p>
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
              <figure className="mb-4 flex flex-col items-center">
                <img src="/src/images/deploymenttable.png" alt="Deployment management table showing release information" className="rounded-md shadow-md border border-gray-200" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Deployment management table showing release information</p>
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
            <h2 className="text-2xl font-bold mb-4">Releasing and Managing Updates</h2>
            <p className="mb-4">
              The dashboard provides a user-friendly interface for managing updates to your apps, while the actual creation of releases is done through the CLI.
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Creating Releases</h3>
              <p className="mb-4">
                Creating releases is performed exclusively through the DOTA CLI, not through the dashboard. For detailed instructions on how to create releases, please refer to the <a href="/documentation/cli/commands" className="text-dota-600 hover:underline">CLI Commands Reference</a>.
              </p>
              <p className="mb-4">
                When creating a release using the CLI, you can specify:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Target deployment environment</li>
                <li>Update packages to upload</li>
                <li>Target binary versions</li>
                <li>Update descriptions (changelog)</li>
                <li>Mandatory update flags</li>
                <li>Rollout percentages</li>
              </ul>
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
                    While releases are created via CLI, you can view and manage them through the dashboard after they're created.
                  </p>
                </div>
              </div>
              <figure className="mb-4 flex flex-col items-center">
                <img src="/src/images/release.gif" alt="Managing release metadata in the DOTA Dashboard" className="rounded-md shadow-md border border-gray-200" />
                <p className="text-gray-600 italic text-sm text-center mt-2">Managing release metadata in the DOTA Dashboard</p>
              </figure>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Patching Update Metadata</h3>
              <p className="mb-4">
                After releasing an update via CLI, you can modify one or more of the metadata attributes through the dashboard:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Mark an update as mandatory</li>
                <li>Change the rollout percentage</li>
                <li>Enable or disable specific releases</li>
                <li>Update the release description</li>
              </ul>
            </div>
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
            <figure className="mb-4 flex flex-col items-center">
              <img src="/src/images/promotedeploy.gif" alt="Promoting an update from Staging to Production" className="rounded-md shadow-md border border-gray-200" />
              <p className="text-gray-600 italic text-sm text-center mt-2">Promoting an update from one deployment to another</p>
            </figure>
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
              <li>Use the CLI to roll back to a specific release</li>
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
              <li>Rollback occurrences</li>
            </ul>
            <p className="mb-4">
              These analytics can help guide your deployment strategy and identify potential issues
              with specific updates or device types.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 
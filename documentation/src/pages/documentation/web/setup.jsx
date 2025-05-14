export default function WebSetup() {
  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>Web Dashboard</span>
        <span className="mx-2">/</span>
        <span>Setup</span>
      </div>

      <div className="flex flex-col">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6">Web Dashboard Setup</h1>

          <div className="mb-8">
            <p className="mb-4">
              This section provides instructions for setting up and accessing the DOTA Web Dashboard, 
              which offers a graphical interface for managing your DOTA deployments.
            </p>
          </div>

          {/* -------------------------------------------------------------
              PREREQUISITES
          ------------------------------------------------------------- */}
          <div className="mb-8" id="prerequisites">
            <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
            <p className="mb-4">
              Before you can set up the DOTA Web Dashboard, you need to install the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">Node Version Manager (nvm)</a> for managing Node.js versions</li>
              <li>pnpm package manager</li>
              <li>Google OAuth credentials (for authentication) or you can use a mock token for development</li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              INSTALLATION
          ------------------------------------------------------------- */}
          <div className="mb-8" id="installation">
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <p className="mb-4">
              Follow these steps to install the DOTA Web Dashboard:
            </p>
            <ol className="list-decimal pl-6 space-y-4 mb-4">
              <li>
                <p className="font-semibold">Install and use the correct Node.js version:</p>
                <pre className="code-block mb-4">
                  <code>{`# Install Node.js 18.18.0
nvm install 18.18.0

# Use Node.js 18.18.0 for this project
nvm use 18.18.0

# Create .nvmrc file to maintain version
echo "18.18.0" > .nvmrc`}</code>
                </pre>
              </li>
              <li>
                <p className="font-semibold">Install pnpm if not already installed:</p>
                <pre className="code-block mb-4">
                  <code>{`npm install -g pnpm`}</code>
                </pre>
              </li>
              <li>
                <p className="font-semibold">Navigate to the web directory and clean up any existing package manager configurations:</p>
                <pre className="code-block mb-4">
                  <code>{`# Navigate to web directory
cd /path/to/dota/web

# Remove any existing Yarn configuration files
rm -rf .yarn .pnp.cjs .yarnrc.yml`}</code>
                </pre>
                <div className="alert-note mb-4">
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
                    <strong>Important:</strong>
                    <p>
                      This cleanup step is required to remove any existing Yarn configuration 
                      which might conflict with pnpm. If you don't have these files, that's fine.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <p className="font-semibold">Install project dependencies:</p>
                <pre className="code-block mb-4">
                  <code>{`pnpm install`}</code>
                </pre>
              </li>
            </ol>
          </div>

          {/* -------------------------------------------------------------
              CONFIGURATION
          ------------------------------------------------------------- */}
          <div className="mb-8" id="configuration">
            <h2 className="text-2xl font-bold mb-4">Configuration</h2>
            <p className="mb-4">
              Set up environment variables by creating a <code>.env</code> file specifically in the <code>/web</code> directory with the following variables:
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Option 1: Using Google OAuth (Production/Staging)</h3>
              <pre className="code-block mb-4">
                <code>{`# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# API Configuration
DOTA_SERVER_URL`}</code>
              </pre>
              <div className="alert-note mb-4">
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
                  <strong>Important:</strong>
                  <p>
                    The Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) should be the same 
                    in both the web directory and api directory's .env files to ensure proper authentication.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-3">Option 2: Bypassing Authentication (Development)</h3>
              <pre className="code-block mb-4">
                <code>{`# Development Authentication Bypass
LOCAL_GOOGLE_TOKEN="mock-google-token"
NODE_ENV=development
SESSION_SECRET=any_random_string_for_development

# API Configuration
DOTA_SERVER_URL='your_local_api_url'`}</code>
              </pre>
              <p className="mb-4">
                Using the <code>LOCAL_GOOGLE_TOKEN</code> variable allows you to bypass the Google OAuth authentication 
                process during development, which is useful when you don't want to set up OAuth credentials.
              </p>
            </div>
            
            <p className="mb-4">
              Replace the placeholder values with your actual credentials and configuration.
            </p>
          </div>

          {/* -------------------------------------------------------------
              AUTHENTICATION
          ------------------------------------------------------------- */}
          <div className="mb-8" id="authentication">
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <p className="mb-4">
              The DOTA Web Dashboard uses Google OAuth for authentication in production environments. 
              For development, you can either set up OAuth credentials or use the mock token approach.
            </p>

            <h3 className="text-xl font-semibold mb-3">Setting Up Google OAuth</h3>
            <p className="mb-4">
              If you choose to use real Google OAuth credentials, follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Go to the <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">Google Developer Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Navigate to "Credentials" and create OAuth 2.0 Client IDs</li>
              <li>Configure the OAuth consent screen with the necessary information</li>
              <li>Set the authorized redirect URIs to include your dashboard URL with the callback path (e.g., <code>http://localhost:3000/auth/google/callback</code>)</li>
              <li>Copy the client ID and client secret to your <code>.env</code> file in the <code>/web</code> directory</li>
              <li>Copy the same credentials to the <code>.env</code> file in the <code>/api</code> directory</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">Using Mock Token for Development</h3>
            <p className="mb-4">
              For local development, you can use the <code>LOCAL_GOOGLE_TOKEN</code> approach:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Add <code>LOCAL_GOOGLE_TOKEN="mock-google-token"</code> to your <code>.env</code> file in the <code>/web</code> directory</li>
              <li>Make sure <code>NODE_ENV=development</code> is set in your environment</li>
              <li>This will bypass the Google OAuth flow and use a mock authentication token instead</li>
            </ol>
          </div>

          {/* -------------------------------------------------------------
              FIRST LOGIN
          ------------------------------------------------------------- */}
          <div className="mb-8" id="first-login">
            <h2 className="text-2xl font-bold mb-4">Running the Dashboard</h2>
            <h3 className="text-xl font-semibold mb-3">Development Mode</h3>
            <p className="mb-4">
              Start the development server with the following command:
            </p>
            <pre className="code-block mb-6">
              <code>{`pnpm dev`}</code>
            </pre>
            <p className="mb-4">
              The dashboard will be available at <code>http://localhost:3000</code>
            </p>

            <h3 className="text-xl font-semibold mb-3">Production Build</h3>
            <p className="mb-4">
              To build and run the application for production:
            </p>
            <pre className="code-block mb-6">
              <code>{`# Build the application
pnpm build

# Start the production server
pnpm start`}</code>
            </pre>
          </div>

          {/* -------------------------------------------------------------
              TROUBLESHOOTING
          ------------------------------------------------------------- */}
          <div className="mb-8" id="troubleshooting">
            <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
            
            <h3 className="text-xl font-semibold mb-3">Node.js Version Issues</h3>
            <p className="mb-4">
              If you encounter Node.js version-related issues:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Ensure you're using the correct version: <code>nvm use 18.18.0</code></li>
              <li>Verify the version: <code>node -v</code> should show <code>v18.18.0</code></li>
              <li>If issues persist, try: <code>nvm install 18.18.0 && nvm use 18.18.0</code></li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">Installation Issues</h3>
            <p className="mb-4">
              If you encounter installation issues:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Clear pnpm cache: <code>pnpm store prune</code></li>
              <li>Remove node_modules: <code>rm -rf node_modules</code></li>
              <li>Make sure you've cleaned up any Yarn configuration: <code>rm -rf .yarn .pnp.cjs .yarnrc.yml</code></li>
              <li>Reinstall dependencies: <code>pnpm install</code></li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">Authentication Issues</h3>
            <p className="mb-4">
              If you encounter authentication issues:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Ensure your Google OAuth credentials are correct and match in both <code>/web/.env</code> and <code>/api/.env</code> files</li>
              <li>Check that your authorized redirect URIs are properly configured in the Google Developer Console</li>
              <li>For development, make sure <code>LOCAL_GOOGLE_TOKEN</code> is correctly set if you're using mock authentication</li>
              <li>Verify that <code>NODE_ENV=development</code> is set when using mock authentication</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 
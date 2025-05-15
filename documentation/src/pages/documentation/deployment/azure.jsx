export default function AzureDeployment() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Azure App Service Deployment</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
        <p className="mb-4">
          Before deploying DOTA Server to Azure App Service, ensure you have the following:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>An Azure account with an active subscription</li>
          <li>Azure CLI installed and configured or Azure Portal access</li>
          <li>A basic understanding of Azure services (App Service, Storage, etc.)</li>
          <li>Your DOTA codebase ready for deployment</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Azure Resource Setup</h2>
        <p className="mb-4">The recommended Azure architecture for DOTA Server includes:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Azure App Service to host the Node.js application</li>
          <li>Azure Blob Storage for storing bundles and assets</li>
          <li>Azure Key Vault for managing secrets (optional)</li>
          <li>Azure CDN for faster content delivery (optional)</li>
          <li>Azure Cache for Redis if using metrics (optional)</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Deployment Steps</h2>

        <ul className="list-disc pl-6 space-y-4 mb-6">
          <li>
            <h3 className="text-xl font-semibold mb-2">Create Resource Group</h3>
            <p className="mb-2">
              First, create a resource group to organize all DOTA Server resources:
            </p>
            <pre className="code-block">
              <code>az group create --name dota-resources --location eastus</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Create Storage Account</h3>
            <p className="mb-2">Set up an Azure Storage account for DOTA bundles:</p>
            <pre className="code-block">
              <code>{`az storage account create \\
  --name dotastorage<unique-suffix> \\
  --resource-group dota-resources \\
  --location eastus \\
  --sku Standard_LRS \\
  --kind StorageV2`}</code>
            </pre>
            <p className="mb-2">Create a container for bundles:</p>
            <pre className="code-block">
              <code>{`# Get storage key
STORAGE_KEY=$(az storage account keys list --resource-group dota-resources --account-name dotastorage<unique-suffix> --query "[0].value" -o tsv)

# Create container
az storage container create \\
  --name bundles \\
  --account-name dotastorage<unique-suffix> \\
  --account-key $STORAGE_KEY \\
  --public-access off`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Create App Service Plan</h3>
            <p className="mb-2">Create an App Service Plan for your DOTA Server:</p>
            <pre className="code-block">
              <code>{`az appservice plan create \\
  --name dota-service-plan \\
  --resource-group dota-resources \\
  --sku B1 \\
  --is-linux`}</code>
            </pre>
            <p className="mt-2 text-sm text-muted-foreground">
              Note: For production environments, consider using a P1V2 (Premium) or higher tier for
              better performance and scaling capabilities.
            </p>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Create Web App</h3>
            <p className="mb-2">Create a Node.js web app for DOTA Server:</p>
            <pre className="code-block">
              <code>{`az webapp create \\
  --name dota-server-<unique-suffix> \\
  --resource-group dota-resources \\
  --plan dota-service-plan \\
  --runtime "NODE|16-lts"`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Configure App Settings</h3>
            <p className="mb-2">Set required environment variables for DOTA Server:</p>
            <pre className="code-block">
              <code>{`az webapp config appsettings set \\
  --name dota-server-<unique-suffix> \\
  --resource-group dota-resources \\
  --settings \\
    STORAGE_ACCOUNT=dotastorage<unique-suffix> \\
    STORAGE_ACCESS_KEY=$STORAGE_KEY \\
    PORT=8080 \\
    SESSION_SECRET=<your-secure-session-secret> \\
    WEBSITE_NODE_DEFAULT_VERSION=16-lts \\
    GITHUB_CLIENT_ID=<your-github-client-id> \\
    GITHUB_CLIENT_SECRET=<your-github-client-secret> \\
    MICROSOFT_CLIENT_ID=<your-microsoft-client-id> \\
    MICROSOFT_CLIENT_SECRET=<your-microsoft-client-secret>`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Deploy from Git Repository</h3>
            <p className="mb-2">Configure deployment from your Git repository:</p>
            <pre className="code-block">
              <code>{`# For GitHub repository
az webapp deployment source config \\
  --name dota-server-<unique-suffix> \\
  --resource-group dota-resources \\
  --repo-url https://github.com/dream-sports-labs/dota \\
  --branch main \\
  --git-token <your-github-token>`}</code>
            </pre>
            <p className="mb-2">
              Alternatively, deploy using Azure DevOps or the Azure CLI local git deployment.
            </p>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">
              Configure Continuous Deployment (Optional)
            </h3>
            <p className="mb-2">
              Set up GitHub Actions for CI/CD by creating a workflow file at{' '}
              <code>.github/workflows/azure-deploy.yml</code>:
            </p>
            <pre className="code-block">
              <code>{`name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: npm install and build
      run: |
        npm install
        npm run build
        
    - name: Deploy to Azure WebApp
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'dota-server-<unique-suffix>'
        publish-profile: \${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .`}</code>
            </pre>
            <p className="mt-2 text-sm text-muted-foreground">
              Note: You'll need to add your Azure Web App publish profile as a GitHub secret.
            </p>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2">Configure Custom Domain and SSL</h3>
            <p className="mb-2">Add a custom domain and enable SSL:</p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>In the Azure Portal, navigate to your Web App</li>
              <li>Select "Custom domains" from the left menu</li>
              <li>Click "Add custom domain" and follow the steps</li>
              <li>After adding the domain, select "Add binding" to enable SSL</li>
            </ol>
            <p className="mb-2">
              You can use a free Azure-managed certificate or upload your own SSL certificate.
            </p>
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Scaling and Monitoring</h2>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">App Service Scaling</h3>
          <p className="mb-2">Configure scaling for your DOTA Server:</p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>In the Azure Portal, navigate to your App Service</li>
            <li>Go to "Scale up (App Service plan)" to change the pricing tier</li>
            <li>Go to "Scale out (App Service plan)" to configure auto-scaling</li>
          </ol>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Monitoring</h3>
          <p className="mb-2">Set up monitoring for your DOTA Server:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Enable Application Insights for application performance monitoring</li>
            <li>Set up alerts for critical metrics (response time, failure rate, etc.)</li>
            <li>Configure log streaming to monitor application logs in real-time</li>
            <li>Continuous monitoring and alerting</li>
          </ul>
        </div>

        <div className="alert-tip">
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
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <div className="alert-content">
            <strong>Tip:</strong>
            <p>
              For high-traffic applications, consider deploying to multiple regions and using
              Traffic Manager for global load balancing.
            </p>
          </div>
        </div>
      </div>

      <div className="alert-warning mb-8">
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
          <strong>Important:</strong>
          <p>
            Azure App Service has a default timeout of 230 seconds for HTTP requests. For
            long-running operations, consider implementing asynchronous processing patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

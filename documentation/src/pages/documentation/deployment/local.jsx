export default function LocalDeployment() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Local Deployment
      </h1>

      {/* Common Setup Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Initial Setup
        </h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <p className="mb-2">Clone the repository:</p>
            <pre className="code-block">
              <code>git clone https://github.com/dream-sports-labs/dota.git</code>
            </pre>
          </li>
          <li>
            <p className="mb-2">Navigate to the project folder:</p>
            <pre className="code-block">
              <code>cd dota</code>
            </pre>
          </li>
          <li>
            <p className="mb-2">Enter the API directory:</p>
            <pre className="code-block">
              <code>cd api</code>
            </pre>
          </li>
          <li>
            <p className="mb-2">Create an environment file:</p>
            <pre className="code-block">
              <code>cp .env.example .env</code>
            </pre>
            <p className="mt-2">
              Configure the <code>.env</code> file based on your storage provider choice below.
              For detailed information on all environment variables, see the{" "}
              <a href="/documentation/configuration/environment" className="text-dota-600 hover:underline">
                Environment Variables
              </a>{" "}
              documentation.
            </p>
          </li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Prerequisites
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Required</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Node.js 20.x or later</li>
              <li>npm or pnpm package manager</li>
              <li>Git for version control</li>
              <li>Docker (for containerized storage options)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Optional</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>nvm for Node.js version management</li>
              <li>Docker Compose for local development</li>
              <li>AWS CLI (for AWS S3 storage)</li>
              <li>Azure CLI (for Azure Blob storage)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Storage Options
        </h2>

        {/* JSON Storage Option */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">
            JSON File Storage
          </h3>
          <p className="mb-4">
            Perfect for development and testing. Uses local JSON files for storage.
          </p>
          
          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Environment Variables:</div>
            <pre className="code-block">
              <code>{`# .env file configuration for JSON storage
STORAGE_PROVIDER=json
EMULATED=TRUE

# Other common settings
PORT=3010
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=dotadb`}</code>
            </pre>
          </div>

          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Available Commands:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border-color py-2 px-4 text-left">Command</th>
                    <th className="border border-border-color py-2 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run json:setup</td>
                    <td className="border border-border-color py-2 px-4">Complete setup for JSON storage</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run dev</td>
                    <td className="border border-border-color py-2 px-4">Start server with configured storage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div className="alert-content">
              <strong>Note:</strong>
              <p>JSON storage is for development only. Use Azure Blob Storage or AWS S3 for production.</p>
            </div>
          </div>
        </div>

        {/* AWS Storage Option */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">
            AWS S3 Storage
          </h3>
          <p className="mb-4">
            Use AWS S3 for storage with LocalStack for local development.
          </p>
          
          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Environment Variables:</div>
            <pre className="code-block">
              <code>{`# .env file configuration for AWS S3 storage
STORAGE_PROVIDER=s3
EMULATED=TRUE

S3_BUCKET=dota-bundles
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566

# Other common settings
PORT=3010
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=dotadb`}</code>
            </pre>
          </div>

          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Available Commands:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border-color py-2 px-4 text-left">Command</th>
                    <th className="border border-border-color py-2 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run dota:cli</td>
                    <td className="border border-border-color py-2 px-4">Complete setup and run (recommended)</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run aws:setup</td>
                    <td className="border border-border-color py-2 px-4">Setup only</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run aws:run</td>
                    <td className="border border-border-color py-2 px-4">Run server only</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run aws:dev</td>
                    <td className="border border-border-color py-2 px-4">Development mode with seeding</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run aws:clean</td>
                    <td className="border border-border-color py-2 px-4">Clean up Docker containers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-medium mb-2 text-base">LocalStack Setup:</div>
            <p className="mb-2">Start LocalStack before running the commands:</p>
            <pre className="code-block">
              <code>docker-compose up -d localstack</code>
            </pre>
          </div>
        </div>

        {/* Azure Storage Option */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">
            Azure Blob Storage
          </h3>
          <p className="mb-4">
            Use Azure Blob Storage with Azurite for local development.
          </p>
          
          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Environment Variables:</div>
            <pre className="code-block">
              <code>{`# .env file configuration for Azure Blob storage
STORAGE_PROVIDER=azure
EMULATED=TRUE

AZURE_STORAGE_ACCOUNT=devstoreaccount1
AZURE_STORAGE_ACCESS_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
AZURE_STORAGE_CONTAINER=dota-bundles

# Other common settings
PORT=3010
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=dotadb`}</code>
            </pre>
          </div>

          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Available Commands:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border-color py-2 px-4 text-left">Command</th>
                    <th className="border border-border-color py-2 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run azure:setup</td>
                    <td className="border border-border-color py-2 px-4">Complete setup</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run azure:init</td>
                    <td className="border border-border-color py-2 px-4">Initialize Azurite</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run azure:dev</td>
                    <td className="border border-border-color py-2 px-4">Development mode with seeding</td>
                  </tr>
                  <tr>
                    <td className="border border-border-color py-2 px-4 font-mono text-sm">npm run azure:seed</td>
                    <td className="border border-border-color py-2 px-4">Seed initial data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-medium mb-2 text-base">Azurite Setup:</div>
            <p className="mb-2">Install and run Azurite:</p>
            <pre className="code-block">
              <code>npm install -g azurite
azurite --silent --location ./azurite-data --debug ./azurite-debug.log</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          HTTPS Configuration (Optional)
        </h2>
        <div>
          <p className="mb-4">
            To run DOTA Server with HTTPS locally:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Create a <code>certs</code> directory in the api folder</li>
            <li>Add your SSL certificate files:
              <ul className="list-disc pl-6 mt-2">
                <li><code>cert.key</code> - Private key</li>
                <li><code>cert.crt</code> - Certificate</li>
              </ul>
            </li>
            <li>Set <code>HTTPS=true</code> in your <code>.env</code> file</li>
          </ol>
          <div className="alert-warning mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div className="alert-content">
              <strong>Note:</strong>
              <p>HTTPS is typically enabled by default when deploying to AWS or Azure App Service.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Next Steps
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Configure Authentication</h3>
            <p className="mb-4">
              Set up authentication providers in your <code>.env</code> file:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>GitHub OAuth</li>
              <li>Microsoft OAuth</li>
              <li>Google OAuth</li>
            </ul>
            <a href="/documentation/configuration/oauth" className="text-dota-600 hover:underline">
              Learn more about OAuth configuration →
            </a>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Production Deployment</h3>
            <p className="mb-4">
              When ready for production, consider these deployment options:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>AWS EC2 with S3 storage</li>
              <li>Azure App Service with Blob Storage</li>
              <li>Self-hosted with your preferred cloud provider</li>
            </ul>
            <a href="/documentation/deployment/aws" className="text-dota-600 hover:underline">
              View deployment guides →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

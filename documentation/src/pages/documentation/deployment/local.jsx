export default function LocalDeployment() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" id="local-deployment">
        Local Deployment
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="prerequisites">
          Prerequisites
        </h2>
        <p className="mb-4">
          The DOTA Server requires storage to operate. For the local setup, there is an option to
          use emulated local storage with Azurite.
        </p>
        <p className="mb-4">
          Please follow Azurite{' '}
          <a
            href="https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite"
            className="text-dota-600 hover:underline"
          >
            official documentation
          </a>{' '}
          to{' '}
          <a
            href="https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio#install-azurite"
            className="text-dota-600 hover:underline"
          >
            install
          </a>{' '}
          and{' '}
          <a
            href="https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio#running-azurite-from-the-command-line"
            className="text-dota-600 hover:underline"
          >
            run
          </a>{' '}
          it locally.
        </p>
        <p className="mb-4">
          Additionally, you need to specify <code>EMULATED</code> flag equals true in the
          environmental variables.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="deployment-steps">
          Steps
        </h2>
        <p className="mb-2">To run the DOTA Server locally, follow these steps:</p>

        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <p>Clone the repository to your local machine.</p>
          </li>

          <li>
            <p>
              Copy the <code>.env.example</code> file to a new file named <code>.env</code> in the
              api directory:
            </p>
            <pre className="code-block">
              <code>cd api
cp .env.example .env</code>
            </pre>
            <p className="mt-2">
              Fill in the values for each environment variable in the <code>.env</code> file
              according to your development or production setup.
            </p>
          </li>

          <li>
            <p>Install all necessary dependencies:</p>
            <pre className="code-block">
              <code>npm install</code>
            </pre>
          </li>

          <li>
            <p>Compile the server code:</p>
            <pre className="code-block">
              <code>npm run build</code>
            </pre>
          </li>

          <li>
            <p>Launch the server with the environment-specific start command:</p>
            <pre className="code-block">
              <code>npm run dev</code>
            </pre>
          </li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="https-configuration">
          HTTPS Configuration
        </h2>
        <p className="mb-4">
          By default, local DOTA server runs on HTTP. To run DOTA Server on HTTPS:
        </p>

        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            Create a <code>certs</code> directory and place <code>cert.key</code> (private key) and{' '}
            <code>cert.crt</code> (certificate) files there.
          </li>
          <li>
            Set environment variable <code>HTTPS</code> to true.
          </li>
        </ol>

        <div className="alert-warning">
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
            <strong>Warning!</strong>
            <p>
              When hosting DOTA on AWS or Azure App Service, HTTPS is typically enabled by default.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p>
          For more detailed instructions and configuration options, please refer to the{' '}
          <a href="/configuration/environment" className="text-dota-600 hover:underline">
            Environment Variables
          </a>{' '}
          documentation.
        </p>
      </div>

      <div className="mt-12 p-6 bg-dota-600/5 border border-dota-600/20 rounded-lg">
        <h2 className="text-2xl font-bold mb-4" id="quickstart">
          Quickstart Options
        </h2>

        <h3 className="text-xl font-semibold mb-3">JSON File Storage</h3>
        <p className="mb-4">
          For a quick local development setup using JSON file-based storage, set the following
          environment variables:
        </p>
        <p className="mb-4">
          <code>STORAGE_PROVIDER=json</code>
          <br />
          <code>EMULATED=TRUE</code>
        </p>
        <p className="mb-4">Then start the development server:</p>
        <pre className="code-block mb-4">
          <code>npm run dev</code>
        </pre>

        <p className="mb-2">
          This configuration will use JSON files for storage instead of Azure Blob Storage, making
          it easy to get started without external dependencies.
        </p>

        <div className="alert-note mt-4 mb-6">
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
              JSON file-based storage is recommended for development and testing purposes only. For
              production environments, use Azure Blob Storage or AWS S3.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">AWS S3 Storage</h3>
        <p className="mb-4">
          For local development with AWS S3 storage, you can use the provided setup script that handles
          environment configuration and service management.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Available Commands</h4>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Complete setup and run:</p>
                <pre className="code-block">
                  <code>npm run aws:setup-run</code>
                </pre>
                <p className="mt-2 text-sm text-gray-600">
                  This is the recommended command for first-time setup and development.
                </p>
              </div>

              <div>
                <p className="mb-2">Setup only:</p>
                <pre className="code-block">
                  <code>npm run aws:setup</code>
                </pre>
                <p className="mt-2 text-sm text-gray-600">
                  Useful for CI/CD pipelines or when you want to set up the environment separately.
                </p>
              </div>

              <div>
                <p className="mb-2">Run server only:</p>
                <pre className="code-block">
                  <code>npm run aws:run</code>
                </pre>
                <p className="mt-2 text-sm text-gray-600">
                  Use this when you've already set up the environment and just need to start the server.
                </p>
              </div>

              <div>
                <p className="mb-2">Clean up:</p>
                <pre className="code-block">
                  <code>npm run aws:clean</code>
                </pre>
                <p className="mt-2 text-sm text-gray-600">
                  Stops and removes Docker containers and volumes. Useful when you need to start fresh.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Environment Configuration</h4>
            <p className="mb-4">
              The setup process uses environment variables for configuration. You can set these in a <code>.env</code> file
              or pass them directly to the commands.
            </p>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Required Environment Variables</h5>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>PORT</code> - Server port (default: 3010)</li>
                  <li><code>DB_HOST</code> - Database host (default: localhost)</li>
                  <li><code>DB_USER</code> - Database user (default: root)</li>
                  <li><code>DB_PASS</code> - Database password (default: root)</li>
                  <li><code>DB_NAME</code> - Database name (default: codepushdb)</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">AWS Configuration</h5>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>STORAGE_PROVIDER</code> - Set to "aws" for AWS storage</li>
                  <li><code>AWS_ACCESS_KEY_ID</code> - AWS access key</li>
                  <li><code>AWS_SECRET_ACCESS_KEY</code> - AWS secret key</li>
                  <li><code>S3_ENDPOINT</code> - S3 endpoint URL</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Node.js Version</h4>
            <p className="mb-4">
              The setup process automatically ensures you're using Node.js version 20. If you don't have it installed,
              the script will attempt to install it using nvm.
            </p>
            <div className="alert-note mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>Make sure you have nvm installed for automatic Node.js version management.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Troubleshooting</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Common Issues</h5>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If the server fails to start, check the <code>server.log</code> file for details</li>
                  <li>Ensure Docker is running before starting the setup</li>
                  <li>Check if the required ports are available</li>
                  <li>Verify your AWS credentials are correct</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">Clean Start</h5>
                <p className="mb-2">If you encounter issues, try cleaning up and starting fresh:</p>
                <pre className="code-block">
                  <code>npm run aws:clean && npm run aws:setup-run</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">Azure Blob Storage</h3>
        <p className="mb-4">
          For development with Azure Blob Storage, set the following environment variables:
        </p>
        <pre className="code-block mb-4">
          <code>{`STORAGE_PROVIDER=azure
EMULATED=TRUE
AZURE_STORAGE_ACCOUNT=your-storage-account-name
AZURE_STORAGE_ACCESS_KEY=your-storage-access-key
AZURE_STORAGE_CONTAINER=your-container-name`}</code>
        </pre>
        <p className="mb-4">Then start the development server:</p>
        <pre className="code-block mb-4">
          <code>npm run dev</code>
        </pre>

        <p className="mb-2">
          Make sure you have created an Azure Storage account and container, and have the necessary
          connection details.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
          <div className="flex">
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-bold">Security Note:</span> For production environments,
                consider using Azure Key Vault to store your storage access keys securely, and using
                managed identities for authentication instead of access keys where possible.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">Local AWS Via LocalStack</h3>
        <p className="mb-4">
          For local development with AWS S3 using LocalStack, follow these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <p>Start the LocalStack container using Docker Compose:</p>
            <pre className="code-block">
              <code>docker-compose up -d localstack</code>
            </pre>
          </li>
          <li>
            <p>Set the following environment variables in your <code>.env</code> file:</p>
            <pre className="code-block">
              <code>{`STORAGE_PROVIDER=s3
EMULATED=TRUE
S3_BUCKET=your-dota-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566`}</code>
            </pre>
          </li>
          <li>
            <p>Run the AWS setup script to create the necessary resources:</p>
            <pre className="code-block">
              <code>npm run aws:setup</code>
            </pre>
          </li>
          <li>
            <p>Start the development server:</p>
            <pre className="code-block">
              <code>npm run dev</code>
            </pre>
          </li>
        </ol>
        <div className="alert-note mt-4 mb-6">
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
              LocalStack provides a fully functional local AWS cloud stack. This setup is ideal for development and testing without incurring AWS costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

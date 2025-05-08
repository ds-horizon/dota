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
          For development with AWS S3 storage, set the following environment variables:
        </p>
        <p className="mb-4">
          <code>STORAGE_PROVIDER=s3</code>
          <br />
          <code>EMULATED=TRUE</code>
          <br />
          <code>S3_BUCKET=your-dota-bucket</code>
          <br />
          <code>S3_REGION=your-aws-region</code>
          <br />
          <code>AWS_ACCESS_KEY_ID=your-access-key</code>
          <br />
          <code>AWS_SECRET_ACCESS_KEY=your-secret-key</code>
        </p>
        <p className="mb-4">Then start the development server:</p>
        <pre className="code-block mb-4">
          <code>npm run dev</code>
        </pre>

        <p className="mb-2">
          Make sure you have created an S3 bucket and have the necessary permissions configured in
          your AWS account.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-bold">Security Note:</span> For production environments, use
                IAM roles instead of hardcoded credentials. Store sensitive information in a secure
                way and not directly in environment variables or code.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">Azure Blob Storage</h3>
        <p className="mb-4">
          For development with Azure Blob Storage, set the following environment variables:
        </p>
        <p className="mb-4">
          <code>STORAGE_PROVIDER=azure</code>
          <br />
          <code>EMULATED=TRUE</code>
          <br />
          <code>AZURE_STORAGE_ACCOUNT=your-storage-account-name</code>
          <br />
          <code>AZURE_STORAGE_ACCESS_KEY=your-storage-access-key</code>
          <br />
          <code>AZURE_STORAGE_CONTAINER=your-container-name</code>
        </p>
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
              <code>STORAGE_PROVIDER=s3
EMULATED=TRUE
S3_BUCKET=your-dota-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566</code>
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

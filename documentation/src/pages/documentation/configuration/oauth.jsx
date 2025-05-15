export default function OAuthConfig() {
  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>Configuration</span>
        <span className="mx-2">/</span>
        <span>OAuth Apps</span>
      </div>

      <h1 className="text-4xl font-bold mb-6">OAuth Apps Configuration</h1>

      <div className="mb-8">
        <p className="mb-4">
          DOTA uses Google as identity provider, so for authentication purposes, you need to have an
          OAuth App registration for DOTA. Client id and client secret created during registration
          should be provided to the DOTA server in environment variables. Below are instructions on
          how to create OAuth App registrations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full">
          <div className="mb-8" id="google-oauth">
            <h2 className="text-2xl font-bold mb-4">Google OAuth</h2>

            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>
                Go to the{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  className="text-dota-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console Credentials page
                </a>
                .
              </li>
              <li>
                Click on <strong>+ CREATE CREDENTIALS</strong> and select{' '}
                <strong>OAuth client ID</strong>.
              </li>
              <li>
                If prompted, configure your <strong>OAuth consent screen</strong> first. You'll need
                to provide an application name, user support email, and developer contact
                information.
              </li>
              <li>
                For <strong>Application type</strong>, select <strong>Web application</strong>.
              </li>
              <li>
                Add your DOTA server URL(s) under{' '}
                <strong>Authorized JavaScript origins</strong>. For example:{' '}
                <code>https://dota-&lt;project-suffix&gt;.net</code> or{' '}
                <code>http://localhost:3000</code> for local development.
              </li>
              <li>
                Add the following URI under <strong>Authorized redirect URIs</strong>:
                <code>
                  https://dota-&lt;project-suffix&gt;.net/auth/google/callback
                </code>
                <p className="text-sm text-muted-foreground mt-1">
                  (For local development, add{' '}
                  <code>http://localhost:3000/auth/google/callback</code> depending on your setup).
                </p>
              </li>
              <li>
                Click <strong>Create</strong>.
              </li>
              <li>
                Copy the generated <strong>Client ID</strong> and <strong>Client Secret</strong>.
                You will need these for your environment variables.
              </li>
            </ol>
          </div>

          <div className="mb-8" id="environment-configuration">
            <h2 className="text-2xl font-bold mb-4">Environment Configuration</h2>

            <p className="mb-4">
              After setting up your Google OAuth application, you need to configure the following
              environment variables for your DOTA server:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Google OAuth Environment Variables</h3>
            <pre className="code-block">
              <code>{`# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret`}</code>
            </pre>
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
              <strong>Security Note:</strong>
              <p>
                Always store your client secrets securely. Never commit them to version control. For
                Azure deployments, use Application Settings to set these values. For AWS, use
                environment variables or AWS Systems Manager Parameter Store.
              </p>
            </div>
          </div>

          <div className="mb-8" id="local-development">
            <h2 className="text-2xl font-bold mb-4">Local Development Authentication</h2>

            <p className="mb-4">
              For local development and testing purposes, you can bypass the Google authentication
              flow by setting an environment variable:
            </p>

            <pre className="code-block">
              <code>{`# Bypass authentication for local development
LOCAL_GOOGLE_TOKEN="mock-google-token"
NODE_ENV=development # or NODE_ENV=test`}</code>
            </pre>

            <p className="mt-4 mb-4">
              This configuration will skip the OAuth authentication process when:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                The <code>NODE_ENV</code> is set to <code>development</code> or <code>test</code>
              </li>
              <li>
                The <code>LOCAL_GOOGLE_TOKEN</code> environment variable is defined
              </li>
            </ul>

            <div className="alert-warning mb-4">
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
                <strong>Warning:</strong>
                <p>
                  This feature should only be used for development and testing. Never enable
                  authentication bypass in production environments.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8" id="testing-authentication">
            <h2 className="text-2xl font-bold mb-4">Testing Authentication</h2>

            <p className="mb-4">After configuring your Google OAuth provider:</p>

            <ol className="list-decimal pl-6 space-y-2">
              <li>Restart your DOTA server to apply the environment variable changes</li>
              <li>Generate an access key from your DOTA server</li>
              <li>Try logging into CLI with the generated access key as your authentication token</li>
              <li>Verify that you can successfully authenticate and access protected resources</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

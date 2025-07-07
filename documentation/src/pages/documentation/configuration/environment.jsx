export default function EnvironmentConfig() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Environment Variables</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          DOTA Server is configured using environment variables. This page lists all available environment variables, their descriptions and default values.
        </p>
        
        <div className="alert-note mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div className="alert-content">
            <strong>Note:</strong>
            <p>You can create a <code>.env</code> file in the api directory of your DOTA Server by copying the <code>.env.example</code> file and filling in the values according to your environment.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Core Mode</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">EMULATED</td>
                <td className="border px-4 py-2">Use emulated storage services</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">NODE_ENV</td>
                <td className="border px-4 py-2">Environment mode (production, development)</td>
                <td className="border px-4 py-2 font-mono">production</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">PORT</td>
                <td className="border px-4 py-2">Port number the server will listen on</td>
                <td className="border px-4 py-2 font-mono">3000</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">SERVER_URL</td>
                <td className="border px-4 py-2">Public URL where the server is hosted</td>
                <td className="border px-4 py-2 font-mono">http://localhost:$&#123;PORT&#125;</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Storage Provider</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">STORAGE_PROVIDER</td>
                <td className="border px-4 py-2">Storage provider to use (azure, aws)</td>
                <td className="border px-4 py-2 font-mono">azure</td>
                <td className="border px-4 py-2">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Azure Blob Storage (if STORAGE_PROVIDER=azure)</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">AZURE_STORAGE_ACCOUNT</td>
                <td className="border px-4 py-2">Azure Storage account name</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for Azure)</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">AZURE_STORAGE_ACCESS_KEY</td>
                <td className="border px-4 py-2">Azure Storage account access key</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for Azure)</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-xl font-bold mb-4">AWS S3 (if STORAGE_PROVIDER=aws)</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">AWS_ACCESS_KEY_ID</td>
                <td className="border px-4 py-2">AWS access key ID</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for AWS)</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">AWS_SECRET_ACCESS_KEY</td>
                <td className="border px-4 py-2">AWS secret access key</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for AWS)</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">S3_BUCKET_NAME</td>
                <td className="border px-4 py-2">S3 bucket name for storing deployments</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for AWS)</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">S3_REGION</td>
                <td className="border px-4 py-2">AWS region for S3 bucket</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes (for AWS)</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">S3_ENDPOINT</td>
                <td className="border px-4 py-2">Custom S3 endpoint (for non-AWS S3 implementations)</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">CLOUDFRONT_DOMAIN</td>
                <td className="border px-4 py-2">CloudFront domain for signed URLs</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">CLOUDFRONT_KEY_PAIR_ID</td>
                <td className="border px-4 py-2">CloudFront key pair ID for signing</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">CLOUDFRONT_PRIVATE_KEY_PATH</td>
                <td className="border px-4 py-2">Path to CloudFront private key file</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Database Configuration</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">DB_HOST</td>
                <td className="border px-4 py-2">Database host</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">DB_PORT</td>
                <td className="border px-4 py-2">Database port</td>
                <td className="border px-4 py-2 font-mono">3306</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">DB_USER</td>
                <td className="border px-4 py-2">Database user</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">DB_PASS</td>
                <td className="border px-4 py-2">Database password</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">DB_NAME</td>
                <td className="border px-4 py-2">Database name</td>
                <td className="border px-4 py-2 font-mono">dotadb</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Cache (Redis)</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">REDIS_HOST</td>
                <td className="border px-4 py-2">Redis server hostname or IP address</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">For metrics</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">REDIS_PORT</td>
                <td className="border px-4 py-2">Redis server port</td>
                <td className="border px-4 py-2 font-mono">6379</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">REDIS_KEY</td>
                <td className="border px-4 py-2">Redis authentication key/password</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">For secured Redis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Authentication</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">GITHUB_CLIENT_ID</td>
                <td className="border px-4 py-2">GitHub OAuth client ID</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">GITHUB_CLIENT_SECRET</td>
                <td className="border px-4 py-2">GitHub OAuth client secret</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">MICROSOFT_CLIENT_ID</td>
                <td className="border px-4 py-2">Microsoft OAuth client ID</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">MICROSOFT_CLIENT_SECRET</td>
                <td className="border px-4 py-2">Microsoft OAuth client secret</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">GOOGLE_CLIENT_ID</td>
                <td className="border px-4 py-2">Google OAuth client ID</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">GOOGLE_CLIENT_SECRET</td>
                <td className="border px-4 py-2">Google OAuth client secret</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No*</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          * At least one authentication provider must be configured (GitHub, Microsoft, or Google).
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Optional Features & Debug</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">LOGGING</td>
                <td className="border px-4 py-2">Enable verbose logging</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">DEBUG_DISABLE_AUTH</td>
                <td className="border px-4 py-2">Disable authentication for development</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">DEBUG_USER_ID</td>
                <td className="border px-4 py-2">User ID to use when auth is disabled</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">DISABLE_ACQUISITION</td>
                <td className="border px-4 py-2">Disable the acquisition endpoints</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">DISABLE_MANAGEMENT</td>
                <td className="border px-4 py-2">Disable the management endpoints</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">ENABLE_ACCOUNT_REGISTRATION</td>
                <td className="border px-4 py-2">Allow new account registration</td>
                <td className="border px-4 py-2 font-mono">true</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">UPLOAD_SIZE_LIMIT_MB</td>
                <td className="border px-4 py-2">Maximum upload size in MB</td>
                <td className="border px-4 py-2 font-mono">200</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">ENABLE_PACKAGE_DIFFING</td>
                <td className="border px-4 py-2">Enable package diffing for optimizing updates</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Testing</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">TEST_AZURE_STORAGE</td>
                <td className="border px-4 py-2">Enable testing with Azure Storage</td>
                <td className="border px-4 py-2 font-mono">false</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">AZURE_ACQUISITION_URL</td>
                <td className="border px-4 py-2">Azure Storage acquisition URL for testing</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Azure KeyVault (Optional)</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Default</th>
                <th className="border px-4 py-2 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-mono">AZURE_KEYVAULT_ACCOUNT</td>
                <td className="border px-4 py-2">Azure KeyVault account name</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">AZURE_CLIENT_ID</td>
                <td className="border px-4 py-2">Azure application client ID</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-mono">AZURE_CERTIFICATE_THUMBPRINT</td>
                <td className="border px-4 py-2">Azure certificate thumbprint</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">No</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2 font-mono">AZURE_REFRESH_INTERVAL</td>
                <td className="border px-4 py-2">Refresh interval for KeyVault in ms</td>
                <td className="border px-4 py-2 font-mono">86400000</td>
                <td className="border px-4 py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Example .env File</h2>
        
        <pre className="code-block">
          <code>{`##########################################
# .env.example for Dota Server
##########################################

# 1) CORE MODE
# -----------------------------------------------------------------------------
EMULATED=false
NODE_ENV=production
PORT=3000
SERVER_URL=http://localhost:\${PORT}

# 2) STORAGE PROVIDER (choose one)
# -----------------------------------------------------------------------------
STORAGE_PROVIDER=azure       # azure | aws

# -- Azure Blob Storage (if STORAGE_PROVIDER=azure) --
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_ACCESS_KEY=

# -- AWS S3 (if STORAGE_PROVIDER=aws) --
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
S3_REGION=
S3_ENDPOINT=

# Optional CloudFront signing
CLOUDFRONT_DOMAIN=
CLOUDFRONT_KEY_PAIR_ID=
CLOUDFRONT_PRIVATE_KEY_PATH=

# 3) DATABASE CONFIGURATION
# -----------------------------------------------------------------------------
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASS=
DB_NAME=dotadb

# 4) CACHE (Redis)
# -----------------------------------------------------------------------------
REDIS_HOST=
REDIS_PORT=6379
REDIS_KEY=

# 5) AUTHENTICATION (at least one)
# -----------------------------------------------------------------------------
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# 6) OPTIONAL FEATURES & DEBUG
# -----------------------------------------------------------------------------
LOGGING=false
DEBUG_DISABLE_AUTH=false
DEBUG_USER_ID=

DISABLE_ACQUISITION=false
DISABLE_MANAGEMENT=false
ENABLE_ACCOUNT_REGISTRATION=true

UPLOAD_SIZE_LIMIT_MB=200
ENABLE_PACKAGE_DIFFING=false

# 7) TESTING
# -----------------------------------------------------------------------------
TEST_AZURE_STORAGE=false
AZURE_ACQUISITION_URL=

# 8) OPTIONAL: Azure KeyVault
# -----------------------------------------------------------------------------
AZURE_KEYVAULT_ACCOUNT=
AZURE_CLIENT_ID=
AZURE_CERTIFICATE_THUMBPRINT=
AZURE_REFRESH_INTERVAL=86400000`}</code>
        </pre>
      </div>
      
      <div className="alert-warning mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div className="alert-content">
          <strong>Security Best Practice:</strong>
          <p>Never commit your <code>.env</code> file to version control. Add it to <code>.gitignore</code> to prevent accidental exposure of sensitive credentials.</p>
        </div>
      </div>
    </div>
  );
} 
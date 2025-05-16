import React from 'react';

export default function Quickstart() {
  return (
    <div className="content">
      <h1 className="text-4xl font-bold mb-6">⚡ Installation & QuickGuide</h1>
      
      {/* Prerequisites Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
        <p className="mb-4">Before you begin, ensure you have the following installed:</p>
        <ul className="list-disc pl-6 mb-2 space-y-2">
          <li className="mb-2">🐳 Docker Desktop (must be running)</li>
          <li className="mb-2">🟢 Node.js (v18+ recommended)</li>
          <li className="mb-2">🛠️ Git</li>
          <li className="mb-2">(Optional) Google OAuth credentials or use passwordless authentication mode for local login</li>
        </ul>
      </div>
      
      {/* One-Line Self-Hosting Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">🚀 QuickGuide: One-Line Self-Hosting</h2>
        <p className="mb-4">Spin up the <strong>entire DOTA toolchain</strong> (API, Web, CLI) in seconds with a single command:</p>
        
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Clone the Repository</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <code className="text-sm font-mono">git clone https://github.com/dream-sports-labs/dota</code>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Run the Launch Script</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <code className="text-sm font-mono">./launchdota.sh {'{directory}'}</code>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Example: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">./launchdota.sh .</code></p>
            
            <div className="alert-note mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 flex">
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
                className="text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <strong className="font-medium">Note:</strong>
                <p className="text-sm text-gray-600 dark:text-gray-300">This will spawn the full end-to-end toolchain in seconds and install DOTA in the specified directory.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <img 
                src="/src/images/quickstart.gif" 
                alt="DOTA Launch Script Demo" 
                className="rounded-lg border border-gray-300 dark:border-gray-600 w-full shadow-md" 
              />
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Demonstration of running the launchdota.sh script for a new DOTA installation</p>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
              <h4 className="text-xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">🚀 One Command. Complete Environment. Instant Deployment.</h4>
              
              <p className="mb-4 text-center font-medium">Within seconds, your entire development stack is ready to use!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md shadow-sm border border-blue-100 dark:border-blue-900">
                  <h5 className="font-semibold flex items-center text-blue-700 dark:text-blue-400"><span className="text-xl mr-2">🌐</span> API Server</h5>
                  <a href="http://localhost:3010" className="text-blue-600 hover:underline block mt-1">http://localhost:3010</a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ready to accept requests from your app</p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md shadow-sm border border-blue-100 dark:border-blue-900">
                  <h5 className="font-semibold flex items-center text-blue-700 dark:text-blue-400"><span className="text-xl mr-2">🖥️</span> Web Dashboard</h5>
                  <a href="http://localhost:3000" className="text-blue-600 hover:underline block mt-1">http://localhost:3000</a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your deployments visually</p>
                </div>
              </div>
              
              <div className="mt-4 bg-white/80 dark:bg-gray-800/80 p-3 rounded-md shadow-sm border border-blue-100 dark:border-blue-900">
                <h5 className="font-semibold flex items-center text-blue-700 dark:text-blue-400"><span className="text-xl mr-2">🕹️</span> CLI Tool</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Open a new shell and start using the CLI:</p>
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
                  <code>dota --version</code><br/>
                  <code>dota whoami</code>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/80 dark:bg-gray-800/80 rounded-md shadow-sm border border-blue-100 dark:border-blue-900">
                <h5 className="font-semibold flex items-center text-blue-700 dark:text-blue-400"><span className="text-xl mr-2">🔑</span> Everything Included</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Local authentication and Docker integration with AWS-like components are included by default</p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-blue-700 dark:text-blue-400 font-semibold">No complex configuration. No dependency nightmares. Just one command.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Installation Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Manual Installation Steps</h2>
        
        <ol className="list-decimal pl-6 mb-6 space-y-4">
          <li>
            <strong>Clone the Repository</strong>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg mt-2">
              <code className="text-sm font-mono">git clone https://github.com/dream-sports-labs/dota</code>
            </div>
          </li>

          <li>
            <strong>Create Environment Files</strong>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg mt-2">
              <code className="text-sm font-mono">./env.dev.sh</code>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Copies env.web.dev to .env files in api and web directories</p>
          </li>

          <li>
            <strong>Navigate to API Directory</strong>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg mt-2">
              <code className="text-sm font-mono">cd api</code>
            </div>
          </li>

          <li>
            <strong>Start Development Server</strong>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg mt-2">
              <code className="text-sm font-mono">npm run dev:web</code>
            </div>
          </li>
        </ol>
      </div>

      {/* Advanced Modes Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">📚 Local Deployment & Advanced Modes</h2>
        <p className="mb-4">DOTA supports multiple storage and cloud providers:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Local Providers</h3>
            <ul className="list-disc pl-6">
              <li>AWS</li>
              <li>Azure</li>
              <li>JSON</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Remote Providers</h3>
            <ul className="list-disc pl-6">
              <li>AWS</li>
              <li>Azure</li>
            </ul>
          </div>
        </div>
        <p className="mb-4">See the <a href="/documentation/deployment/local" className="text-blue-600 hover:underline">Local Deployment documentation</a> for advanced installation modes, cloud integration plugins, and configuration (including GCP/passwordless authentication mode setup).</p>
      </div>

      {/* Verification Section */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-2">Verification</h3>
        <p className="mb-2">After successful installation, you should see:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li className="flex items-center">
            <span className="mr-2">🌐</span> Server running at <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded ml-1">http://localhost:3010</code>
          </li>
          <li className="flex items-center">
            <span className="mr-2">🕹️</span> CLI logged in (verify with <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded mx-1">dota --version</code> and <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded mx-1">dota whoami</code>)
          </li>
          <li className="flex items-center">
            <span className="mr-2">🖥️</span> Web server running at <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded ml-1">http://localhost:3000</code>
          </li>
        </ul>
      </div>
    </div>
  );
} 
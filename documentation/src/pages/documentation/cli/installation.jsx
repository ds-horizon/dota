export default function CLIInstallation() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">DOTA CLI Installation</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">
          DOTA CLI enables you to push bundles that automatically create a corresponding version that is available instantly to be downloaded and tested.
        </p>
        
        <div className="alert-tip mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <div className="alert-content">
            <strong>Tip:</strong>
            <p>Add <strong>dota-cli</strong> as dev dependency as it's only for development purposes.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Open Source & Contributions</h2>
        <p className="mb-4">
          DOTA CLI is <strong>open-source</strong>! Interested in helping us improve? Check out our GitHub Repository to get started! From feature suggestions to bug fixes, all contributions are welcome.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <p className="mb-4">To install the CLI open terminal and navigate to the root of your project and run:</p>
        
        <div className="space-y-6">
          <div>
            <p className="font-medium mb-2">With npm:</p>
            <pre className="code-block">
              <code>npm install --save-dev dota-cli</code>
            </pre>
          </div>
          
          <div>
            <p className="font-medium mb-2">With Yarn:</p>
            <pre className="code-block">
              <code>yarn add -D dota-cli</code>
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Verifying Installation</h3>
        <p className="mb-4">
          After installing the CLI, you can verify it's working correctly by running:
        </p>
        <pre className="code-block">
          <code>npx dota --version</code>
        </pre>
        <p className="mt-4">
          This should display the version number of the installed DOTA CLI.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Global Installation (Optional)</h3>
        <p className="mb-4">
          If you prefer to install the CLI globally, you can run:
        </p>
        <pre className="code-block">
          <code>npm install -g dota-cli</code>
        </pre>
        <p className="mt-4">
          With a global installation, you can run commands directly without using <code>npx</code>:
        </p>
        <pre className="code-block">
          <code>dota --version</code>
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">
          However, we recommend installing as a dev dependency in your project to ensure all team members use the same CLI version.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="mb-4">
          For usage and API Reference provided by DOTA CLI, check the <a href="/documentation/cli/commands" className="text-dota-600 hover:underline">Usage Documentation</a>.
        </p>
      </div>
    </div>
  );
} 
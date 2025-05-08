export default function Home() {
  return (
    <div className="content-with-toc home-content content">
      <div className="hero-section mb-12 bg-gradient-to-b from-dota-700/10 to-transparent p-6 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" id="overview">DOTA - Over-the-Air Updates for React Native Apps</h1>
        
        <p className="text-lg mb-6">
          DOTA enables React Native developers to deploy mobile app updates directly to their users' devices. 
          It consists of two parts: DOTA Server where developers publish app updates (JS, HTML, CSS or image changes), 
          and <a href="https://github.com/microsoft/react-native-code-push" className="text-dota-600 hover:underline">DOTA React Native Client SDK</a> that 
          enables querying for updates from within an app.
        </p>
        
        <ul className="flex flex-wrap gap-4 mt-6 list-none p-0">
          <li>
            <link href="/documentation/installation" className="inline-block bg-dota-600 hover:bg-dota-700 text-white px-6 py-3 rounded-md transition-colors font-medium">
              Get Started
            </link>
          </li>
          <li>
            <a href="https://github.com/microsoft/react-native-code-push" target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-md transition-colors font-medium">
              GitHub Repository
            </a>
          </li>
        </ul>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" id="key-features">🚀 Overview</h2>
        <p className="mb-4">
          DOTA provides a complete solution for React Native over-the-air updates, allowing you to make instant updates without going through the app store or play store review process.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Deploy app updates without going through distribution stores</li>
              <li>Target updates to specific app versions</li>
              <li>Control the rollout percentage of updates</li>
              <li>Make updates mandatory when critical</li>
              <li>Monitor deployment metrics</li>
              <li>Manage multiple deployment environments (Staging, Production)</li>
            </ul>
          </div>
          
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">DOTA Components</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">DOTA Server</h4>
                <p>The backend service where developers publish app updates. It can be deployed to AWS, Azure, or run locally.</p>
              </div>
              <div>
                <h4 className="font-medium">DOTA CLI</h4>
                <p>A command-line tool that allows developers to interact with the DOTA server for managing deployments.</p>
              </div>
              <div>
                <h4 className="font-medium">React Native SDK</h4>
                <p>Client library that enables React Native apps to check for and apply updates from the DOTA server.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" id="getting-started">📦 Getting Started</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">DOTA Server</h3>
            <p className="mb-4">
              The DOTA server allows you to build, deploy and manage DOTA updates yourself. Deploy it to your preferred infrastructure.
            </p>
            <p className="mt-6">
              <link href="/documentation/installation" className="text-dota-600 hover:underline font-medium">
                Server Installation →
              </link>
            </p>
          </div>
          
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">DOTA CLI</h3>
            <p className="mb-4">
              The command-line tool allows developers to interact with the DOTA server for managing deployments.
            </p>
            <p className="mt-6">
              <link href="/documentation/cli/installation" className="text-dota-600 hover:underline font-medium">
                Get Started with CLI →
              </link>
            </p>
          </div>
          
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">Client SDK</h3>
            <p className="mb-4">
              The React Native client SDK enables your app to check for and apply updates from the DOTA server.
            </p>
            <p className="mt-6">
              <a href="https://github.com/microsoft/react-native-code-push" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline font-medium">
                Configure React Native →
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" id="deployment-options">🛠️ Deployment Options</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">Local Deployment</h3>
            <p className="mb-4">
              For development or self-hosted environments, DOTA can be run locally with storage support (Azure Blob Storage or Azurite emulator).
            </p>
            <p className="mt-6">
              <link href="/documentation/deployment/local" className="text-dota-600 hover:underline">
                Local Deployment Guide →
              </link>
            </p>
          </div>
          
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">AWS Deployment</h3>
            <p className="mb-4">
              DOTA can be deployed to AWS using your preferred AWS services for computing and storage (docker emulator locally).
            </p>
            <p className="mt-6">
              <link href="/documentation/deployment/aws" className="text-dota-600 hover:underline">
                AWS Deployment Guide →
              </link>
            </p>
          </div>
          
          <div className="bg-card dark:bg-gray-800 border border-card-border dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">Azure Deployment</h3>
            <p className="mb-4">
              DOTA is designed to run as an Azure App Service with Azure Blob Storage for backend storage needs.
            </p>
            <p className="mt-6">
              <link href="/documentation/deployment/azure" className="text-dota-600 hover:underline">
                Azure Deployment Guide →
              </link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';

export default function Quickstart() {
  return (
    <div className="content">
      <h1 className="text-4xl font-bold mb-6">Quickstart Guide</h1>
      
      <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
      <p className="mb-4">Before you begin, ensure you have the following installed:</p>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Docker Desktop (must be running)</li>
        <li className="mb-2">npm (Node Package Manager)</li>
        <li className="mb-2">Google OAuth configuration (optional)</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">Installation Steps</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">1</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Clone the Repository</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">git clone https://github.com/dream-sports-labs/dota</code>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">2</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Run the Launch Script</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">./launchdota.sh /path/to/your/directory</code>
            </div>
            
            <div className="alert-note mt-3">
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
                <p>This will install DOTA in the specified directory. The directory will be automatically added to .gitignore if it's a git repository.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <img 
                src="/src/images/launchdota.gif" 
                alt="DOTA Launch Script Demo" 
                className="rounded-lg border border-border-color w-full shadow-md" 
              />
              <p className="mt-2 text-sm text-center text-muted-foreground">Demonstration of running the launchdota.sh script for a new DOTA installation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border-color">
        <h3 className="text-xl font-semibold mb-2">Verification</h3>
        <p className="mb-2">After successful installation, you should see:</p>
        <ul className="list-disc pl-6">
          <li>Server running at <code className="bg-muted px-1 rounded">http://localhost:3010</code></li>
          <li>CLI logged in (verify with <code className="bg-muted px-1 rounded">dota --version</code> and <code className="bg-muted px-1 rounded">dota whoami</code>)</li>
          <li>Web server running at <code className="bg-muted px-1 rounded">http://localhost:3000</code></li>
        </ul>
      </div>
    </div>
  );
} 
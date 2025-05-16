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
            <h3 className="text-lg font-semibold mb-2">Create Environment Files</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">./env.dev.sh</code>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Copies env.web.dev to .env files in api and web directories</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">3</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Navigate to API Directory</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">cd api</code>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">4</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Start Development Server</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">npm run dev:web</code>
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
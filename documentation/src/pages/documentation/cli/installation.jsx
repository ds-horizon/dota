export default function CLIInstallation() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">DOTA CLI Installation</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          The DOTA CLI is a tool that enables you to push mobile app updates to the Dota service
          directly from your development machine. This lets you create new app versions instantly,
          where they can be tested or deployed to users as needed.
        </p>

        {/* <div className="alert-tip mb-6">
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
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <div className="alert-content">
            <strong>Tip:</strong>
            <p>
              Add <strong>dota-cli</strong> as a dev dependency to keep your CLI version locked
              and consistent for all team members.
            </p>
          </div>
        </div> */}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Open Source & Contributions</h2>
        <p className="mb-4">
          DOTA CLI is <strong>open source</strong>. Interested in helping us improve? Check out our
          GitHub <a href="https://github.com/ds-horizon/dota" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">repository</a> for details on how to contribute fixes or features. We appreciate all
          your input and feedback!
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <p className="mb-4">
          From your project's root directory, run one of the following commands to install the CLI
          locally (recommended):
        </p>

        <div className="space-y-6">
          <div>
            <p className="font-medium mb-2">Using npm:</p>
            <pre className="code-block">
              <code>npm run dota:cli</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Verifying Installation</h3>
        <p className="mb-4">
          If installed locally (as shown above), you can run all CLI commands via <code>npx</code>:
        </p>
        <pre className="code-block mb-4">
          <code>npx dota --version</code>
        </pre>
        <p className="mb-4">
          This should print the version number of the installed DOTA CLI (matching what's in your
          <code>package.json</code> under <code>devDependencies</code>).
        </p>
        <p className="mb-4">
          Alternatively, if you added the CLI globally, you can verify by running:
        </p>
        <pre className="code-block">
          <code>dota --version</code>
        </pre>
      </div>

      <div className="bg-accent border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Optional: Global Installation</h3>
        <p className="mb-4">
          If you prefer to install the CLI globally on your system, run:
        </p>
        <pre className="code-block mb-4">
          <code>npm install --global dota-cli</code>
        </pre>
        <p className="mb-4">
          Once installed globally, you can issue commands like:
        </p>
        <pre className="code-block mb-4">
          <code>dota --version</code>
        </pre>
        <p className="text-sm text-muted-foreground">
          We recommend local installation for consistent CLI versions across your team, but global
          installation can be convenient if you're the only one working on a project or if you need
          to run <code>dota</code> from scripts without <code>npx</code>.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="mb-4">
          Once installed, explore the various commands and features of the CLI. See the{" "}
          <a
            href="/documentation/cli/commands"
            className="text-dota-600 hover:underline"
          >
            CLI Usage Guide
          </a>{" "}
          to get started creating, managing, and deploying your apps and updates with DOTA.
        </p>
      </div>
    </div>
  );
}

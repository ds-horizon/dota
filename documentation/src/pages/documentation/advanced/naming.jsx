export default function NamingLimitations() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Naming Limitations</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Project Suffix</h2>

        <p className="mb-4">
          When deploying DOTA to Azure or other cloud platforms, there are specific naming
          limitations you need to follow for project suffixes:
        </p>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-medium">1. Character Restrictions</h3>
            <p>Only letters are allowed.</p>
          </div>

          <div>
            <h3 className="font-medium">2. Length Restriction</h3>
            <p>Maximum 15 characters.</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Project Suffix</th>
                <th className="border px-4 py-2 text-left">Valid</th>
                <th className="border px-4 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">
                  <code>myapp</code>
                </td>
                <td className="border px-4 py-2 text-green-600">✓ Valid</td>
                <td className="border px-4 py-2">Only letters, under 15 characters</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2">
                  <code>myappproduction</code>
                </td>
                <td className="border px-4 py-2 text-red-600">✗ Invalid</td>
                <td className="border px-4 py-2">Too long (16 characters)</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  <code>my-app</code>
                </td>
                <td className="border px-4 py-2 text-red-600">✗ Invalid</td>
                <td className="border px-4 py-2">Contains hyphen (non-letter)</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="border px-4 py-2">
                  <code>myapp1</code>
                </td>
                <td className="border px-4 py-2 text-red-600">✗ Invalid</td>
                <td className="border px-4 py-2">Contains number (non-letter)</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  <code>productionapp</code>
                </td>
                <td className="border px-4 py-2 text-green-600">✓ Valid</td>
                <td className="border px-4 py-2">Only letters, exactly 13 characters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reasoning Behind Limitations</h2>

        <p className="mb-4">
          These naming restrictions are primarily driven by Azure's resource naming conventions and
          limitations:
        </p>

        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Letters-only requirements ensure compatibility with DNS naming conventions</li>
          <li>
            Length restrictions accommodate Azure's URL structure when combined with service
            prefixes
          </li>
          <li>Consistency in naming makes resource management and identification easier</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Other Naming Considerations</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">Storage Account Names</h3>
            <p className="mb-4">
              Storage account names must be between 3 and 24 characters and can contain only
              lowercase letters and numbers.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="font-medium mb-1">Valid:</p>
                <code>dotastoragemyapp</code>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <p className="font-medium mb-1">Invalid:</p>
                <code>dota-storage-myapp</code> (contains hyphens)
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3">App Service Names</h3>
            <p className="mb-4">
              App Service names must be unique across all of Azure, as they form part of the default
              URL.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="font-medium mb-1">Valid URL:</p>
                <code>dota-myapp.azurewebsites.net</code>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <p className="font-medium mb-1">Invalid URL:</p>
                <code>dota_myapp.azurewebsites.net</code> (contains underscore)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert-tip mb-8">
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
          <strong>Best Practice:</strong>
          <p>
            Choose a short, memorable project suffix that clearly identifies your application while
            complying with naming restrictions. Consider using abbreviations or shortened versions
            of longer application names.
          </p>
        </div>
      </div>
    </div>
  );
}

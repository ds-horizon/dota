import React from 'react';

export default function PluginsGuide() {
  return (
    <div className="content">
      <h1 className="text-4xl font-bold mb-6">🔌 DOTA Plugin Guide</h1>
      <p className="mb-4">
        DOTA is designed to be highly extensible. Its plugin system allows you to customize or replace core features to fit your workflow, compliance, or infrastructure needs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Plugin Types</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><b>Storage Plugins</b>: S3, Azure Blob, local, or custom storage backends.</li>
        <li><b>Database Plugins</b>: MySQL, Postgres, or custom (via Sequelize dialects).</li>
        <li><b>Auth Plugins</b>: Google OAuth, passwordless authentication, or custom OAuth providers (future: Guardian, etc.).</li>
        <li><b>Metrics Plugins</b>: Redis, OSS Cache, Azure Cache with Cluster Mode, or custom metrics backends.</li>
        <li><b>Cohorting Plugins</b>: Rule-based targeting by attributes (deployment key, app version/range, environment, user cohort, platform, app, tenant, etc.).</li>
        <li><b>RBAC Plugins</b>: Inbuilt, or configurable (future: Casbin, etc.).</li>
      </ul>

      
      <h2>CLI Plugin Configuration System</h2>
      <p>
        <b>What are CLI Shortcuts?</b><br/>
        CLI shortcuts are pre-configured command-line flags that let you quickly set up DOTA for the most common deployment scenarios—such as local development, AWS, or Azure production—without having to remember or type out all the individual plugin options. These shortcuts automatically select the right storage, database, authentication, and metrics settings for you. They are designed to make onboarding and environment setup fast and error-free for both new and advanced users.
      </p>
      <p>
        <b>Why use them?</b><br/>
        Instead of specifying every plugin and environment variable manually, you can use a shortcut like <code>--aws-local</code> or <code>--azure-prod</code> to instantly configure your environment for that scenario. This reduces mistakes, saves time, and ensures consistency across teams and deployments. If you need a custom setup, you can still use the full set of plugin options.
      </p>

      <h3>Usage</h3>
      <p>
        You can launch the DOTA toolchain with a single command, specifying your target directory and plugin options:
      </p>
      <pre><code>./launchdota.sh &lt;target_directory&gt; [plugin options] [--help]</code></pre>

      <h3>Shortcut Commands</h3>
      <p>For common setups, use these shortcuts. Each shortcut pre-configures the most common plugin layers for a specific scenario:</p>

      <h4>--- aws-local</h4>
      <table className="table-auto mb-2">
        <thead>
          <tr><th>Plugin Layer</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Cloud Provider</td><td>AWS</td></tr>
          <tr><td>Storage</td><td>S3 (or LocalStack)</td></tr>
          <tr><td>Scope</td><td>local (development, emulated)</td></tr>
          <tr><td>Database</td><td>MySQL</td></tr>
          <tr><td>Auth</td><td>Passwordless (mock token)</td></tr>
          <tr><td>Metrics</td><td>Single Redis instance</td></tr>
        </tbody>
      </table>
      <b>Example:</b>
      <pre><code>./launchdota.sh . --aws-local</code></pre>

      <h4>--- azure-local</h4>
      <table className="table-auto mb-2">
        <thead>
          <tr><th>Plugin Layer</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Cloud Provider</td><td>Azure</td></tr>
          <tr><td>Storage</td><td>Azure Blob</td></tr>
          <tr><td>Scope</td><td>local (development, emulated)</td></tr>
          <tr><td>Database</td><td>Azure Data Tables (or Azurite Table emulator)</td></tr>
          <tr><td>Auth</td><td>Passwordless (mock token)</td></tr>
          <tr><td>Metrics</td><td>Single Redis instance</td></tr>
        </tbody>
      </table>
      <b>Example:</b>
      <pre><code>./launchdota.sh . --azure-local</code></pre>
      <p><b>Note:</b> When using Azure storage, DOTA stores all metadata in Azure Data Tables (or Azurite Table emulator in local mode). MySQL is not required for these modes.</p>

      <h4>--- aws-prod</h4>
      <table className="table-auto mb-2">
        <thead>
          <tr><th>Plugin Layer</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Cloud Provider</td><td>AWS</td></tr>
          <tr><td>Storage</td><td>S3</td></tr>
          <tr><td>Scope</td><td>prod (production, not emulated)</td></tr>
          <tr><td>Database</td><td>MySQL</td></tr>
          <tr><td>Auth</td><td>Google OAuth (requires client ID/secret)</td></tr>
          <tr><td>Metrics</td><td>Single Redis instance</td></tr>
        </tbody>
      </table>
      <b>Example:</b>
      <pre><code>./launchdota.sh . --aws-prod --googleClientId=xxx --googleClientSecret=yyy</code></pre>

      <h4>--- azure-prod</h4>
      <table className="table-auto mb-2">
        <thead>
          <tr><th>Plugin Layer</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Cloud Provider</td><td>Azure</td></tr>
          <tr><td>Storage</td><td>Azure Blob</td></tr>
          <tr><td>Scope</td><td>prod (production, not emulated)</td></tr>
          <tr><td>Database</td><td>Azure Data Tables (or Azurite Table emulator)</td></tr>
          <tr><td>Auth</td><td>Google OAuth (requires client ID/secret)</td></tr>
          <tr><td>Metrics</td><td>Single Redis instance</td></tr>
        </tbody>
      </table>
      <b>Example:</b>
      <pre><code>./launchdota.sh . --azure-prod --googleClientId=xxx --googleClientSecret=yyy</code></pre>
      <p><b>Note:</b> When using Azure storage, DOTA stores all metadata in Azure Data Tables (or Azurite Table emulator in local mode). MySQL is not required for these modes.</p>

      <h3>Getting Help</h3>
      <p>To see all available options, mappings, and examples, run:</p>
      <pre><code>./launchdota.sh --help</code></pre>
      <p>
        This will print a detailed help message, including all shortcut commands, plugin options, and usage patterns. You can also use <code>--help</code> with any combination of arguments:
      </p>
      <pre><code>./launchdota.sh . --aws-local --help</code></pre>

      <h3>Notes</h3>
      <ul>
        <li>The CLI validates your plugin combinations and will print clear errors for unsupported setups.</li>
        <li>Shortcut flags override other options if present.</li>
        <li>The help system is always up to date with the latest CLI features.</li>
      </ul>
      <p>
        For more details, see the <code>generate-env.sh</code> script or run <code>./generate-env.sh --help</code> directly.
      </p>
    </div>
  );
} 
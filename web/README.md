# DOTA Web Dashboard

The DOTA Web Dashboard provides a user-friendly interface to manage deployments, monitor metrics, and configure your DOTA environment.

## Quickstart

```bash
cd web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

See [Web Dashboard Documentation](https://dota.dreamsportslabs.com/documentation/web/dashboard) for detailed usage and configuration.

## Support

- [Ask a Question (Discord)](https://discord.gg/Sa6a5Scj)
- [Report an Issue](https://github.com/dream-sports-labs/dota/issues)

## Features Overview

The DOTA Web Dashboard is a comprehensive management interface for DOTA (Distributed Over-The-Air Updates), providing powerful features to help you manage your app deployments efficiently:

-   🔐 **Authentication & Authorization**
    -   Google OAuth integration for secure login
    -   Mock token support for local development
    -   Role-based access control with fine-grained permissions
    -   Secure session management

-   🏢 **Organization Management**
    -   Create and manage multiple organizations
    -   Organization-specific settings and configurations
    -   Team collaboration features with shared access
    -   Hierarchical structure for enterprise environments

-   📱 **Application Management**
    -   Create and manage applications across multiple platforms
    -   Multi-platform support (iOS, Android, Windows)
    -   App metrics and health monitoring dashboards
    -   Detailed version history tracking

-   🚀 **Deployment Features**
    -   Visual deployment management across environments
    -   One-click promotion between environments (dev → staging → production)
    -   Phased rollouts with percentage-based targeting
    -   Instant rollbacks to previous versions
    -   Mandatory update flagging for critical releases
    -   Deployment key management

-   📊 **Analytics & Monitoring**
    -   Real-time metrics on update adoption rates
    -   Device and platform distribution analytics
    -   Success/failure tracking for deployments
    -   User engagement metrics with Redis integration (optional)
    -   Historical performance data visualization

-   🔌 **Infrastructure Integration**
    -   Support for multiple storage backends (AWS S3, Azure Blob, local)
    -   Visual configuration of provider settings
    -   Infrastructure health monitoring
    -   Seamless switching between environments

-   🧑‍🤝‍🧑 **Advanced Targeting & Cohorting**
    -   Target updates by app version using semantic versioning
    -   User segmentation capabilities for gradual rollouts
    -   A/B testing support through deployment targeting
    -   Platform-specific update management

-   ⚙️ **System Configuration**
    -   Visual environment configuration
    -   Plugin management and configuration
    -   Storage provider settings management
    -   Authentication provider configuration

## Web Dashboard Usage Guide

### App Management
The app management section allows you to create and manage applications for your organization. Before you can deploy any updates, you need to register an app with the DOTA service.
All new apps automatically come with two deployments (Staging and Production).

**Creating an App**
To create an app:
1.  Log in to DOTA Dashboard.
2.  Click the **Add new app** in the upper-right corner of the page (or press the `C` key).
3.  Populate the panel that appears with information about the new app.

**Note:**
If your app targets both iOS and Android, please create separate apps for each platform with DOTA (e.g., MyApp-iOS and MyApp-Android).

### Organization Management
The organization management section allows you to create and manage organizations. Organizations provide a way to group apps and collaborators for team-based workflows.
You can view all organizations associated with your account, manage organization settings, and control access to organization resources.

**Accessing Organizations**
All of your organizations are accessible in the left navigation panel of the DOTA Dashboard. Organizations are the owners of apps, so when you create an app in a different organization, that organization is automatically created if it doesn't already exist.

### Collaborator Management
DOTA allows you to add collaborators to your app, enabling other developers to deploy updates to your app's deployments. The collaborator management interface provides:
-   Adding new collaborators via email
-   Removing collaborators from your app
-   Viewing and managing all collaborators for your app

**Adding Users to an Organization**
You can add users to an organization indirectly through an app. Here's how:
1.  Select an app within an organization
2.  Click on "Go to app" and select "Collaborators" from the top toggle-tab options
3.  Select "Add collaborator"
4.  Type the user's email address to add the user

### Token Management
Tokens enable you to authenticate with the DOTA service without needing to use your Google credentials. The dashboard provides interfaces for:
-   Creating new tokens
-   Removing tokens that are no longer needed
-   Viewing all tokens associated with your account

### Deployment Management
From the DOTA perspective, an app is simply a named grouping for one or more "deployments." While the app represents a conceptual "namespace," its deployments represent the actual targets for releasing updates (for developers) and synchronizing updates (for end-users).

**Default Deployments**
Each app will have two deployments created by default: **Production** and **Staging**. These deployments are ready to use immediately after app creation.

**Deployment Actions**
The dashboard provides several ways to manage your deployments:
-   **Create** - Add new deployment environments beyond the default ones
-   **Search** - Find specific deployments from the dropdown menu
-   **Delete** - Remove deployments that are no longer needed
You can quickly access deployment actions by pressing `⌘`+`K` (Command+K) to open the command menu for creating and searching deployments.

**Copying Deployment Keys**
Deployment keys are required when configuring your mobile app to receive updates from DOTA. You can easily copy any deployment key directly from the dashboard using the "Copy Deployment Key" button.

**Deployment Management Table**
The deployments table shows key information about each deployment, including:
-   Label - The release identifier
-   Target Versions - The app versions this update applies to
-   Status - Current state of the deployment
-   Mandatory - Whether the update is required
-   Rollbacks - Number of automatic rollbacks
-   Active Devices - Number of devices using this version
-   Rollout - Percentage of users receiving this update
-   Released At - Timestamp of the release

**Note:**
Installation metrics are displayed in the deployment view, showing active users, total installations, pending updates, rollbacks, and more.

### Releasing and Managing Updates
The dashboard provides a user-friendly interface for managing updates to your apps, while the actual creation of releases is done through the CLI.

**Creating Releases**
Creating releases is performed exclusively through the DOTA CLI, not through the dashboard. For detailed instructions on how to create releases, please refer to the [CLI Usage Guide](/documentation/cli/commands).
When creating a release using the CLI, you can specify:
-   Target deployment environment
-   Update packages to upload
-   Target binary versions
-   Update descriptions (changelog)
-   Mandatory update flags
-   Rollout percentages

**Note:**
While releases are created via CLI, you can view and manage them through the dashboard after they're created.

**Patching Update Metadata**
After releasing an update via CLI, you can modify one or more of the metadata attributes through the dashboard:
-   Mark an update as mandatory
-   Change the rollout percentage
-   Enable or disable specific releases
-   Update the release description

### Promoting Updates
Once you've tested an update in a specific deployment (e.g., Staging), you can promote it "downstream" (e.g., Production) using the dashboard. This creates a new release for the destination deployment with the same code and metadata from the source deployment's latest release.
When promoting an update, you can override certain properties like description, rollout percentage, and whether the update is mandatory.

### Rolling Back Updates
If you release an update that is broken or contains unintended features, you can easily roll it back using the dashboard. This will:
-   Disable the current release
-   Re-enable the previous working release
-   Use the CLI to roll back to a specific release

### Viewing Release History
The dashboard provides a comprehensive view of release history for each deployment, including:
-   Release labels and timestamps
-   Mandatory/disabled flags
-   Release descriptions
-   Author information
-   Installation metrics

### Analytics and Reporting
The dashboard provides analytics and reporting features to help you understand your app's update performance:
-   Installation success/failure rates
-   Active user counts
-   Device and OS distribution
-   Update adoption rates
-   Rollback occurrences
These analytics can help guide your deployment strategy and identify potential issues with specific updates or device types.

## Prerequisites

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) for managing Node.js versions
- pnpm package manager
- Google OAuth credentials (for authentication)

## Installation

1. Install and use the correct Node.js version:
   ```bash
   # Install Node.js 18.18.0
   nvm install 18.18.0
   
   # Use Node.js 18.18.0 for this project
   nvm use 18.18.0
   
   # Create .nvmrc file to maintain version
   echo "18.18.0" > .nvmrc
   ```

2. Install pnpm if not already installed:
   ```bash
   npm install -g pnpm
   ```

3. Install project dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Authentication
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret

   # Server Configuration
   DOTA_URL=your_api_url
   ```

## Development

Start the development server:
```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

## Building for Production

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## Project Structure

```
web/
├── app/
│   ├── components/     # Reusable UI components
│   ├── routes/        # Application routes and pages
│   ├── utils/         # Utility functions and helpers
│   ├── assets/        # Static assets
│   └── root.tsx       # Root layout component
├── public/            # Public static files
├── scripts/           # Build and utility scripts
└── server.mjs         # Production server entry
```

## API Endpoints

The dashboard provides the following main API endpoints:

- `/api/v1/tenants` - Tenant management
- `/api/v1/access-keys` - Access key management
- `/api/v1/:org/apps` - Application management
- `/api/v1/:app/deployments` - Deployment management
- `/api/v1/:app/collaborators` - Collaborator management

## Troubleshooting

### Node.js Version Issues
If you encounter Node.js version-related issues:
1. Ensure you're using the correct version: `nvm use 18.18.0`
2. Verify the version: `node -v` should show `v18.18.0`
3. If issues persist, try: `nvm install 18.18.0 && nvm use 18.18.0`

### Installation Issues
If you encounter installation issues:
1. Clear pnpm cache: `pnpm store prune`
2. Remove node_modules: `rm -rf node_modules`
3. Reinstall dependencies: `pnpm install`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

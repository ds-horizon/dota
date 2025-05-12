# DOTA Web Dashboard

The DOTA Web Dashboard is a comprehensive management interface for DOTA (Distributed Over-The-Air Updates), built with Remix and React. It provides a user-friendly interface for managing organizations, applications, deployments, and access control.

## Features

- 🔐 **Authentication**
  - Google OAuth integration
  - Secure session management
  - Role-based access control

- 🏢 **Organization Management**
  - Create and manage organizations
  - Organization-specific settings
  - Team collaboration features

- 📱 **Application Management**
  - Create and manage applications
  - View application details and metrics
  - Manage app deployments
  - Handle app collaborators

- 🚀 **Deployment Features**
  - Create and manage deployments
  - Promote deployments between environments
  - Manage deployment tokens
  - View deployment history and status

- 🔌 **API Integration**
  - RESTful API endpoints
  - Access key management
  - Tenant management
  - Deployment management

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

   # API Configuration
   API_URL=your_api_url
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

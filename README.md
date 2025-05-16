###### ⚠️ This is a fork of [code-push-server](https://github.com/microsoft/code-push-server). All credit goes to the original author.

# DOTA - Over-the-Air Updates for React Native Apps

DOTA empowers React Native developers to deliver over-the-air (OTA) updates directly to user devices, bypassing app store delays and enabling rapid iteration. DOTA is a self-hostable OTA update server that can be deployed locally or on any cloud provider, giving you full control over your update pipeline and user data.


## 🚀 Overview

DOTA provides a complete solution for React Native over-the-air updates, allowing you to:

- Deploy app updates without going through app stores
- Target updates to specific app versions
- Control the rollout percentage of updates
- Make updates mandatory when critical
- Monitor deployment metrics
- Manage multiple deployment environments (Staging, Production)

## 🔗 Quick Links

- [Detailed Documentation](https://dota.dreamsportslabs.com/)
- [Ask a Question (Discord)](https://discord.gg/Sa6a5Scj)
- [Report an Issue](https://github.com/dream-sports-labs/dota/issues)

## 📦 Getting Started

## ⚡ Installation & QuickGuide

### Prerequisites

- 🐳 **Docker Desktop** (must be running)
- 🟢 **Node.js** (v18+ recommended)
- 🛠️ **Git**
- (Optional) Google OAuth credentials or use a mock token for local login

---

### 🚀 QuickGuide: One-Line Self-Hosting

Spin up the **entire DOTA toolchain** (API, Web, CLI) in seconds with a single command:

```bash
./launchdota.sh {directory}
# Example:
./launchdota.sh .
```

- 🌐 API server: [http://localhost:3010](http://localhost:3010)
- 🖥️ Web dashboard: [http://localhost:3000](http://localhost:3000)
- 🕹️ CLI: Open a new shell and run:
  ```bash
  dota --version
  dota whoami
  ```
- 🔑 Local authentication and Docker integration with AWS-like components are included by default.

> **This will spawn the full end-to-end toolchain in seconds.**

![Quickstart Demo](documentation/src/images/quickstart.gif)

---

### 📚 Local Deployment & Advanced Modes

DOTA supports multiple storage and cloud providers:
- **Local:** AWS, Azure, JSON
- **Remote:** AWS, Azure

See the [Local Deployment documentation](/documentation/deployment/local) for advanced installation modes, cloud integration plugins, and configuration (including GCP/Mock token setup).

## 🤝 Contribute to DOTA

DOTA is an open-source project and welcomes contributions from the community. For details on how to contribute, please see our [guide to contributing](/CONTRIBUTING.md).

### DOTA Server

The DOTA Server is a deployable artifact that can be run locally or on any cloud provider. It enables you to self-host your own OTA update service for React Native apps, with quick local launch and full cloud configurability. You can use DOTA as a base component to spawn a self-hosted server, or integrate it into your existing infrastructure.

- **Local Deployment:** Launch instantly for development or testing.
- **Cloud Deployment:** Configure for AWS, Azure, or your preferred provider.

See [Quick Setup](#quick-setup) and [API documentation](./api/README.md) for details.

### Local Deployment

Run DOTA Server on your own infrastructure for development or production.  
See [API documentation](./api/README.md) for prerequisites and setup steps.

### DOTA CLI

The DOTA CLI, located in the `cli` subdirectory, is a command-line tool that allows developers to interact with the DOTA server. For detailed information about the DOTA CLI, including installation instructions and usage details, please refer to the [DOTA CLI README](./cli/README.md).

### DOTA Web

The DOTA Web Dashboard, located in the `web` subdirectory, is a web-based management interface that provides a user-friendly way to manage your deployments, monitor metrics, and configure your DOTA environment. For detailed information about the DOTA Web Dashboard, including installation instructions and usage details, please refer to the [DOTA Web README](./web/README.md).

## 🛠️ Tech Stack

- Node.js (>=18.0.0)
- TypeScript
- React (Web Dashboard)
- Docker (for containerization)

## 🛠️ Deployment Options

### Local Deployment

For development or self-hosted environments, DOTA can be run locally. The server requires storage support (Azure Blob Storage or Azurite emulator locally).

### AWS Deployment

To deploy on AWS:
1. Set up IAM roles and permissions.
2. Configure S3 for storage.
3. Set environment variables in `.env` for AWS credentials and S3 bucket.
4. Follow [AWS Setup Guide](./documentation/src/pages/documentation/deployment/aws.jsx) for step-by-step instructions.

### Azure Deployment

DOTA is designed to run as an Azure App Service with Azure Blob Storage for backend storage needs.

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and fill in the required values for your environment.  
See [Environment Setup Guide](./api/ENVIRONMENT.md) for details.

> **Note:** DOTA supports Google OAuth and mock token login for development. Microsoft and GitHub OAuth are not required.

## ⚖️ License

This code is provided under the MIT License, see the [LICENSE](./LICENSE) to learn more.

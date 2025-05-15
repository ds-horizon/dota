###### ⚠️ This is a fork of [code-push-server](https://github.com/microsoft/code-push-server). All credit goes to the original author.

# DOTA - Over-the-Air Updates for React Native Apps

DOTA enables React Native developers to deploy mobile app updates directly to their users' devices. It consists of two parts: DOTA Server where developers publish app updates (JS, HTML, CSS or image changes), and [Microsoft React Native Client SDK](https://github.com/microsoft/react-native-code-push) that enables querying for updates from within an app.

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
- [Installation Guide](https://dota.dreamsportslabs.com/documentation/cli/installation)
- [Product Guide](https://dota.dreamsportslabs.com/documentation/web/dashboard)
- [Connect with us on discord](https://discord.gg/Sa6a5Scj)

## 📦 Getting Started

### DOTA Server

The DOTA server, located in the `api` subdirectory, allows you to build, deploy and manage DOTA updates yourself. You can deploy the server in multiple ways:

- **AWS** - Deploy to your own AWS infrastructure
- **Azure** - Run as an Azure App Service
- **Local** - Run on your own servers or development environment

For detailed information about the DOTA server, including installation instructions and usage details, please refer to the [DOTA Server README](./api/README.md).

### DOTA CLI

The DOTA CLI, located in the `cli` subdirectory, is a command-line tool that allows developers to interact with the DOTA server. For detailed information about the DOTA CLI, including installation instructions and usage details, please refer to the [DOTA CLI README](./cli/README.md).

### DOTA Web

The DOTA Web Dashboard, located in the `web` subdirectory, is a web-based management interface that provides a user-friendly way to manage your deployments, monitor metrics, and configure your DOTA environment. For detailed information about the DOTA Web Dashboard, including installation instructions and usage details, please refer to the [DOTA Web README](https://dota.dreamsportslabs.com/documentation/web/dashboard).

## 🛠️ Deployment Options

### Local Deployment

For development or self-hosted environments, DOTA can be run locally. The server requires storage support (Azure Blob Storage or Azurite emulator locally).

### AWS Deployment

DOTA can be deployed to AWS using your preferred AWS services for computing and storage(docker emulator locally).

### Azure Deployment

DOTA is designed to run as an Azure App Service with Azure Blob Storage for backend storage needs.

## ⚖️ License

This code is provided under the MIT License, see the [LICENSE](./LICENSE) to learn more.

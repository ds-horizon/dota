# DOTA CLI

The DOTA CLI is a Node.js application that allows users to interact with DOTA Server.

## Features

The DOTA CLI provides powerful features to manage your over-the-air updates efficiently:

- 🚀 **Instant Updates Delivery**: Push updates directly to user devices without app store review delays
- 🧑‍🤝‍🧑 **Advanced Targeting & Cohorting**: Target updates by deployment key, app version, or tenant
- ⚡ **Mandatory Updates**: Force critical updates by enabling the mandatory flag
- 🗂️ **Semantic Versioning Support**: Target specific app versions using semver ranges
- 📊 **Release Metrics**: View detailed analytics on update adoption and performance
- 🔄 **Rollouts & Phased Releases**: Control update distribution with percentage-based rollouts
- ⏪ **Instant Rollbacks**: Quickly revert to previous versions if issues are detected
- 🔌 **Multi-Environment Support**: Manage deployments across development, staging, and production
- 🔐 **Access Key Management**: Create and manage access keys for CI/CD integration

## Quick Start

```bash
cd cli
npm install
npm run build
npm install -g .
dota login --accessKey <your-access-key>
```

## Getting Started

1. Create a DOTA account and DOTA-fy your app using the DOTA CLI.
2. Register your app with DOTA, and optionally share it with other developers on your team.
3. DOTA-fy your app and point it at the deployment you wish to use.
4. Release an update for your app.
5. Check out the debug logs to ensure everything is working as expected.

## CLI Usage Guide

For a complete list of available commands and their usage, please refer to the [DOTA CLI Documentation](https://dota.dreamsportslabs.com/documentation/cli/commands).

## Support

- [Ask a Question (Discord)](https://discord.gg/tUpDV8EaDM)
- [Report an Issue](https://github.com/ds-horizon/dota/issues)
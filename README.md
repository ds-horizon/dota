###### ⚠️ This is a fork of [code-push-server](https://github.com/microsoft/code-push-server). All credit goes to the original author.

# DOTA - Over-the-Air Updates for React Native Apps

DOTA is a self-hostable, modular toolchain that empowers React Native developers to deliver over-the-air (OTA) updates directly to user devices—bypassing app store delays and enabling rapid adoption. Deploy locally or on your preferred cloud, use the full stack or just the components you need, and extend easily with plugins for storage, auth, and metrics.

### Why DOTA?
- 🚀 Instantly push updates—no app store or distribution delays.
- 🏗️ Full control: run locally or on any supported cloud.
- 🔌 Flexible and extensible: mix, match, and extend with plugins.
- 🧑‍🤝‍🧑 **Cohorting**: Target updates by deployment key, app version, tenant, or RBAC.
- ⚡ **Force Update**: Instantly require users to update by enabling mandatory updates.
- 🗂️ **Version Control**: Multi-version, partitioned, and semantic versioning support.

## ✨ Features

- 🔄 **OTA Updates** for React Native apps
- 🏗️ **Self-hostable**: Run locally, on-prem, or in your cloud
- 🔌 **Pluggable Provider System**: Easily switch between Local, AWS, Azure, or custom storage backends
- 🐳 **Docker-First**: Emulated environments with LocalStack, MySQL, and more
- 🛡️ **Secure Auth**: Google OAuth or mock token for local/dev
- 📊 **Metrics & Monitoring**: Optional Redis integration for advanced analytics
- 🛠️ **CLI, Web Dashboard, and API**: Full toolchain for devs and ops

---

## 🔗 Quick Links

- [Quickstart Guide](/documentation/quickstart)
- [Deployment Techniques](/documentation/deployment)
- [Web Dashboard](/documentation/web/dashboard)
- [CLI Usage Guide](/documentation/cli/commands)
- [Plugin System](/documentation/plugins)
- [Ask a Question (Discord)](https://discord.gg/Sa6a5Scj)
- [Report an Issue](https://github.com/dream-sports-labs/dota/issues)

---

## 📦 Installation

### Prerequisites

- 🐳 **Docker Desktop** (must be running)
- 🟢 **Node.js** (v18+ recommended)
- 🛠️ **Git**
- (Optional) Google OAuth credentials or use a mock token for local login

### ⚡ Quickstart

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

> **Note:** By default, this launches a **mock local deployment** (no GCP secret required), using emulated Docker components:
> - S3 (via LocalStack)
> - EC2
> - MySQL (sandboxed)
>
> You can change provider settings (e.g., use real AWS, Azure, or GCP secrets) by editing `.env.example` and running the script accordingly.

![Quickstart Demo](documentation/src/images/quickstart.gif)

For a step-by-step installation guide, see the [Quickstart Documentation](/documentation/quickstart).

#### Option 2: Manual Local Deployment (Step-by-Step)

If you prefer a step-by-step approach instead of the one-line quickstart, follow these instructions:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dream-sports-labs/dota
   ```
2. **Create Environment Files**
   ```bash
   ./env.dev.sh
   ```
   (Copies `env.web.dev` to `.env` files in `api` and `web` directories)
3. **Navigate to API Directory**
   ```bash
   cd api
   ```
4. **Start Development Server**
   ```bash
   npm run dev:web
   ```

For more details and troubleshooting, see the [Quickstart Documentation](/documentation/quickstart).

---

## 🚀 Deployment Techniques & Provider Integration

DOTA supports a flexible, plugin-based provider system. You can deploy and scale your update server in any environment:

| Mode         | Providers/Plugins                | Use Case                |
|--------------|----------------------------------|-------------------------|
| **Local**    | JSON, LocalStack (S3, EC2), MySQL| Dev, CI, sandbox        |
| **AWS**      | S3, EC2, RDS                     | Production, scale       |
| **Azure**    | Blob Storage, App Service        | Production, enterprise  |
| **Custom**   | Bring your own plugin            | Advanced, hybrid cloud  |

- **Switch providers** by editing your `.env` and running the setup script.
- **Plugin system**: Easily add new storage or auth backends.
- **Metrics**: Enable Redis for advanced analytics.

See the [Deployment Documentation](/documentation/deployment) for detailed guides and configuration examples.

## 🔌 Plugin System & Extensibility

DOTA's plugin system lets you extend or replace core features:
- **Storage Plugins**: S3, Azure Blob, local, or custom.
- **Auth Plugins**: Google OAuth, mock, Guardian (future).
- **Metrics Plugins**: Redis, custom analytics.
- **Cohorting Plugins**: Target by deployment key, app version/range, environment, platform, or tenant.
- **RBAC Plugins**: Inbuilt, configurable (future, e.g. [Casbin](https://github.com/casbin/casbin) support).

> **Impact:** Adapt DOTA to any workflow, compliance need, or infrastructure—just like hot-updater's build, storage, and database plugins.

Want to add your own? See the [Plugin Guide](/documentation/plugins).

---

## 📖 API Documentation

- [API Reference](/documentation/api)
- [CLI Usage Guide](/documentation/cli/commands)
- [Web Dashboard](/documentation/web/dashboard)
- [Plugin System](/documentation/plugins)

---

## ⚙️ Tech Stack

- Node.js (>=18.0.0)
- TypeScript
- React (Web Dashboard)
- Docker (for containerization)
- Redis (optional, for metrics)

---

## 🏢 Created by DreamSportsLabs

DreamSportsLabs is committed to building open-source tools that empower developers and businesses. Learn more about us at our [website](https://dreamsportslabs.com/).

---

## 🤝 Contribute to DOTA

DOTA is an open-source project and welcomes contributions from the community. For details on how to contribute, please see our [guide to contributing](/CONTRIBUTING.md).

---

## ⚖️ License

This code is provided under the MIT License, see the [LICENSE](./LICENSE) to learn more.

---

## ✉️ Contact

If you need feedback or support, reach out via the [Issue Tracker](https://github.com/dream-sports-labs/dota/issues) or [Discord](https://discord.gg/Sa6a5Scj).

###### ⚠️ This is a fork of [code-push-server](https://github.com/microsoft/code-push-server). All credit goes to the original author.

# DOTA - Over-the-Air Updates for React Native Apps

DOTA is a self-hostable, modular toolchain that empowers React Native developers to deliver over-the-air (OTA) updates directly to user devices—bypassing app store delays and enabling rapid adoption. Deploy locally or on your preferred cloud, use the full stack or just the components you need, and extend easily with [supported plugins](documentation/plugins).

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
- 🔌 **Pluggable Provider System**: Multi-platform cloud plugin provider
- 🐳 **Docker-First**: Emulated environments with LocalStack, MySQL, and more
- 🛡️ **Secure Auth**: Google OAuth or mock token for local/dev
- 📊 **Metrics & Monitoring**: Optional Redis integration for advanced analytics
- 🛠️ **CLI, Web Dashboard, and API**: Full toolchain for devs and ops

---

## 🔗 Quick Links

- [Quickstart Guide](https://dota.dreamsportslabs.com/documentation/quickstart)
- [Deployment Techniques](https://dota.dreamsportslabs.com/documentation/deployment)
- [Web Dashboard](https://dota.dreamsportslabs.com/documentation/web/dashboard)
- [CLI Usage Guide](https://dota.dreamsportslabs.com/documentation/cli/commands)
- [Plugin System](https://dota.dreamsportslabs.com/documentation/plugins)
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
> You can change provider settings (e.g., use real AWS, Azure, or GCP secrets) by editing `.env.dev.web`. For details, see the [Environment Configuration Guide](documentation/environment).

![Quickstart Demo](documentation/src/images/quickstart.gif)

For a step-by-step installation guide, see the [Quickstart Documentation](https://dota.dreamsportslabs.com/documentation/quickstart).

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

For more details and troubleshooting, see the [Quickstart Documentation](https://dota.dreamsportslabs.com/documentation/quickstart).

---

## 🚀 Deployment Techniques & Provider Integration

DOTA supports a flexible, plugin-based provider system. You can deploy and scale your update server in any environment:

You can change provider settings (e.g., use real AWS, Azure, or GCP secrets) by editing `.env.dev.web`. For details, see the [Environment Configuration Guide](documentation/environment).

| Mode         | Storage/DB Plugins (Docker/Emulated)         | Cloud Providers (Production)         | Analytics/Other Plugins         | Notes/Custom Support           |
|--------------|----------------------------------------------|--------------------------------------|---------------------------------|-------------------------------|
| **Local**    | LocalStack (S3, EC2), MySQL, Redis, Azurite  | -                                    | Redis, custom                   | Run all in Docker; emulate AWS/Azure; switch DB dialect (MySQL/Postgres) |
| **AWS**      | S3, EC2, RDS (MySQL/Postgres)                | AWS                                  | Redis, custom                   | Use real AWS creds; production scale |
| **Azure**    | Blob Storage, App Service, Azurite           | Azure                                | Redis, custom                   | Use real Azure creds; production scale |
| **Custom**   | Any plugin (e.g., Supabase, Cloudflare)      | Any                                  | Any                             | Bring your own plugin; hybrid/multi-cloud supported |

- **Database plugin**: Switch between MySQL, Postgres, or other supported dialects via Sequelize.
- **Analytics plugin**: Enable Redis or custom analytics.
- **Full flexibility**: Mix and match plugins for storage, database, analytics, and more.

See the [Deployment Documentation](https://dota.dreamsportslabs.com/documentation/deployment) for detailed guides and configuration examples.

## 🔌 Plugin System & Extensibility

DOTA's plugin system lets you extend or replace core features:
- **Storage Plugins**: S3, Azure Blob, local, or custom.
- **Database Plugins**: MySQL, Postgres, or custom (via Sequelize dialects).
- **Auth Plugins**: Google OAuth, mock, Guardian (future).
- **Metrics Plugins**: Redis, custom analytics.
- **Cohorting Plugins**: Rule-based targeting by attributes (deployment key, app version/range, environment, user cohort, platform, app, tenant, etc.)—fully configurable via plugins (see [Plugin Guide](/documentation/plugins)).
- **RBAC Plugins**: Inbuilt, configurable (future, e.g. [Casbin](https://github.com/casbin/casbin) support).

> **Impact:** Adapt DOTA to any workflow, compliance need, or infrastructure—just like hot-updater's build, storage, and database plugins.

Want to add your own? See the [Plugin Guide](https://dota.dreamsportslabs.com/documentation/plugins).

---

## 📖 API Documentation

- [API Reference](https://dota.dreamsportslabs.com/documentation/api)
- [CLI Usage Guide](https://dota.dreamsportslabs.com/documentation/cli/commands)
- [Web Dashboard](https://dota.dreamsportslabs.com/documentation/web/dashboard)
- [Plugin System](https://dota.dreamsportslabs.com/documentation/plugins)

---

## ⚙️ TechStack Used:

- <span style="display: flex; align-items: center;"><img src="app/assets/nodejs.png" alt="Node.js" style="width:16px; height:auto; margin-right:5px;"> <a href="https://nodejs.org/" target="_blank">Node.js</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/typescript.png" alt="TypeScript" style="width:16px; height:auto; margin-right:5px;"> <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/react.png" alt="React" style="width:16px; height:auto; margin-right:5px;"> <a href="https://react.dev/" target="_blank">React</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/docker.png" alt="Docker" style="width:16px; height:auto; margin-right:5px;"> <a href="https://www.docker.com/" target="_blank">Docker</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/remix.png" alt="Remix" style="width:16px; height:auto; margin-right:5px;"> <a href="https://remix.run/" target="_blank">Remix</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/redis.png" alt="Redis" style="width:16px; height:auto; margin-right:5px;"> <a href="https://redis.io/" target="_blank">Redis</a></span>
- <span style="display: flex; align-items: center;"><img src="app/assets/sequelize.png" alt="Sequelize" style="width:16px; height:auto; margin-right:5px;"> <a href="https://sequelize.org/" target="_blank">Sequelize</a></span>

---

## <img src="app/assets/d11-logo.png" style="width:24px; height:auto; padding-top:8px;" /> Created by DreamSportsLabs

DreamSportsLabs is committed to building open-source tools that empower developers and businesses. Learn more about us at our [website](https://dreamsportslabs.com/).

## 🚀 Contribute to DOTA

<<<<<<< HEAD
## 🤝 Contribute to DOTA

DOTA is an open-source project and welcomes contributions from the community. For details on how to contribute, please see our [guide to contributing](https://dota.dreamsportslabs.com/CONTRIBUTING.md).
=======
DOTA is an open-source project and welcomes contributions from the community. For details on how to contribute, please see our [guide to contributing](reference/CONTRIBUTING.md).
>>>>>>> 9a1ba27 (updated readme)

---

## ⚖️ License

This code is provided under the MIT License, see the [LICENSE](./LICENSE) to learn more.

---

## ✉️ Contact

If you need feedback or support, reach out via the [Issue Tracker](https://github.com/dream-sports-labs/dota/issues) or [Discord](https://discord.gg/Sa6a5Scj).

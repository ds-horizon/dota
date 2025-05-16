###### ⚠️ This is a fork of [code-push-server](https://github.com/microsoft/code-push-server). All credit goes to the original author.

# DOTA - Over-the-Air Updates for React Native Apps

DOTA empowers React Native developers to deliver over-the-air (OTA) updates directly to user devices, bypassing app store delays and enabling rapid iteration. DOTA is a self-hostable OTA update server that can be deployed locally or on any cloud provider, giving you full control over your update pipeline and user data.

---

## ✨ Key Features

- 🔄 **OTA Updates** for React Native apps
- 🏗️ **Self-hostable**: Run locally, on-prem, or in your cloud
- 🔌 **Pluggable Provider System**: Easily switch between Local, AWS, Azure, or custom storage backends
- 🐳 **Docker-First**: Emulated environments with LocalStack, MySQL, and more
- 🛡️ **Secure Auth**: Google OAuth or mock token for local/dev
- 📊 **Metrics & Monitoring**: Optional Redis integration for advanced analytics
- 🛠️ **CLI, Web Dashboard, and API**: Full toolchain for devs and ops

---

## ⚡ Quickstart

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

---

## 🔌 Plugin System

DOTA is designed to be extensible. You can add or swap provider plugins for:
- Storage (S3, Azure Blob, local JSON, etc.)
- Authentication (Google OAuth, mock, custom)
- Metrics (Redis, custom analytics)

Want to add your own? See the [Plugin Guide](/documentation/plugins).

---

## 📚 Local Deployment & Advanced Modes

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

## 🤝 Contribute to DOTA

DOTA is an open-source project and welcomes contributions from the community. For details on how to contribute, please see our [guide to contributing](/CONTRIBUTING.md).

---

## 🗂️ Documentation

- [Quickstart Guide](/documentation/quickstart)
- [Deployment Techniques](/documentation/deployment)
- [Web Dashboard](/documentation/web/dashboard)
- [CLI Usage Guide](/documentation/cli/commands)
- [Plugin System](/documentation/plugins)

---

## 💬 Support

- [Ask a Question (Discord)](https://discord.gg/Sa6a5Scj)
- [Report an Issue](https://github.com/dream-sports-labs/dota/issues)

---

## ⚖️ License

This code is provided under the MIT License, see the [LICENSE](./LICENSE) to learn more.

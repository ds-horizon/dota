# DOTA Server

The DOTA Server is a Node.js application that powers the DOTA Service. It allows users to deploy and manage over-the-air updates for their react-native applications in a self-hosted environment.

Please refer to [react-native-code-push](https://github.com/microsoft/react-native-code-push) for instructions on how to onboard your application to DOTA.

## Deployment

DOTA Server can be deployed in multiple ways: locally for development, on AWS for cloud-native infrastructure, or on Azure App Service.

### Local

#### Prerequisites

The DOTA Server requires storage to operate. For local setup, you have the following options:
- **Authentication**: You can use passwordless authentication mode or GCP secret (if set up)
- **Storage Options**: AWS S3, Azure Blob Storage, JSON storage, or just spawn a server

To set up your local environment:
1. Ensure you have Node.js installed
2. Configure authentication using either passwordless authentication mode or GCP secret
3. Choose and configure your preferred storage option

#### Steps
To run the DOTA Server locally, follow these steps:

1. Clone the repository to your local machine.
2. Copy the `.env.example` file to a new file named `.env` in the api directory:
   ```bash
   cd api
   cp .env.example .env
   ```
   Fill in the values for each environment variable in the `.env` file according to your development or production setup. See [ENVIRONMENT.md](./ENVIRONMENT.md) for details.
3. Install all necessary dependencies:
   ```bash
   npm install
   ```
4. Compile the server code:
   ```bash
   npm run build
   ```
5. Launch the server with the environment-specific start command:
   ```bash
   npm run dev
   ```

By default, local DOTA server runs on HTTP. To run DOTA Server on HTTPS:

1. Create a `certs` directory and place `cert.key` (private key) and `cert.crt` (certificate) files there.
2. Set environment variable [HTTPS](./ENVIRONMENT.md#https) to true.
 
> **Warning!** When hosting DOTA on AWS or Azure App Service, HTTPS is typically enabled by default.

For more detailed instructions and configuration options, please refer to the [ENVIRONMENT.md](./ENVIRONMENT.md) file.

### Production

For production deployments, GCP-based OAuth authentication is supported. You can deploy to:
- AWS (follow the [AWS setup documentation](https://dota.dreamsportslabs.com/documentation/deployment/aws))
- Azure App Service (follow the [Azure setup documentation](https://dota.dreamsportslabs.com/documentation/deployment/azure))
- Custom server deployment

#### Authentication
Production environments should use GCP-based OAuth for secure user authentication. This provides:
- Secure identity verification
- Managed user sessions
- Integration with Google authentication systems

Configure GCP OAuth by following these steps:
1. Set up a GCP OAuth client in the Google Cloud Console
2. Configure the redirect URIs for your application
3. Add the client ID and secret to your environment variables

#### Deployment Options
Choose the deployment option that best fits your infrastructure:

1. **AWS**: Best for teams already using AWS infrastructure
2. **Azure**: Optimized for Microsoft cloud environments
3. **Custom Server**: For self-managed infrastructure

### AWS

To deploy on AWS:
1. Set up IAM roles and permissions.
2. Configure S3 for storage.
3. Set environment variables in `.env` for AWS credentials and S3 bucket.
4. Use the provided [schema.sql](./schema.sql) and [migration.sql](./migration.sql) files to set up and migrate your database.
5. Follow [AWS Setup Guide](https://dota.dreamsportslabs.com/documentation/deployment/aws) for step-by-step instructions.

### Azure

DOTA Server is designed to run as [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview).

#### Prerequisites

To deploy DOTA to Azure, an active Azure account and subscription are needed. 
For more information, follow Azure's [official documentation](https://azure.microsoft.com/en-us/get-started/).
During the deployment process, the included bicep script will create bare minimum Azure services needed to run DOTA Server including:
1. Service plan
2. App Service
3. Storage account

Additionally, for user authentication, a Google OAuth application is needed. 
You may also use passwordless authentication mode for development. See [ENVIRONMENT.md](./ENVIRONMENT.md) for details.

#### Steps

**NOTE** Please be aware of [project-suffix naming limitations](#project-suffix) for resources in Azure.

1. Login to your Azure account: `az login`
2. Select subscription for deployment: `az account set --subscription <subscription-id>`
3. Create resource group for DOTA resources: `az group create --name <resource-group-name> --location <az-location eg. eastus>`
4. Deploy infrastructure with the next command: `az deployment group create --resource-group <resource-group-name> --template-file ./dota-infrastructure.bicep --parameters project_suffix=<project-suffix> az_location=<az-location eg. eastus> google_client_id=<google-client-id> google_client_secret=<google-client-secret>`. OAuth parameters are optional. It is possible to specify them after the deployment in environment settings of Azure WebApp.
5. Deploy DOTA to the Azure WebApp created during infrastructure deployment. Follow the Azure WebApp [official documentation](https://learn.microsoft.com/en-us/azure/app-service/) "Deployment and configuration" section for detailed instructions.

> **Warning!** The created Azure Blob Storage has default access settings. 
> This means that all users within the subscription can access the storage account tables. 
> Adjusting the storage account access settings to ensure proper security is the responsibility of the owner.

> For more detailed deployment instructions, visit the [Azure setup documentation](https://dota.dreamsportslabs.com/documentation/deployment/azure).

## Configure react-native-code-push

In order for [react-native-code-push](https://github.com/microsoft/react-native-code-push) to use your server, additional configuration value is needed.

### Android

in `strings.xml`, add following line, replacing `server-url` with your server.

```
<string moduleConfig="true" name="CodePushServerUrl">server-url</string>
```

### iOS

in `Info.plist` file, add following lines, replacing `server-url` with your server.

```
<key>CodePushServerURL</key>
<string>server-url</string>
```

## Database Schema & Migrations

- See [schema.sql](./schema.sql) for the initial schema.
- See [migration.sql](./migration.sql) for example migrations.

## License

MIT
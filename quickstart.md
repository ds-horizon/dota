## Quickstart with Emulated Storage

For a quick local development setup using JSON file-based storage:

```bash
# Set environment variables 
export STORAGE_PROVIDER=json 
export EMULATED=TRUE 
# Start the development server 
npm run dev
```

This configuration will use JSON files for storage instead of Azure Blob Storage, making it easy to get started without external dependencies.

Note: JSON file-based storage is recommended for development and testing purposes only. For production environments, use Azure Blob Storage or AWS S3.

## Quickstart with AWS S3 Storage

For a quick development setup with AWS S3 storage:

```bash
# Set environment variables 
export STORAGE_PROVIDER=s3 
export EMULATED=TRUE 
export S3_BUCKET=your-dota-bucket 
export S3_REGION=your-aws-region 
export AWS_ACCESS_KEY_ID=your-access-key 
export AWS_SECRET_ACCESS_KEY=your-secret-key 
# Start the development server 
npm run dev
```

Make sure you have created an S3 bucket and have the necessary permissions configured in your AWS account.

Security Note: For production environments, use IAM roles instead of hardcoded credentials. Store sensitive information in a secure way and not directly in environment variables or code.

## Quickstart with Azure Blob Storage

For a quick development setup with Azure Blob Storage:

```bash
# Set environment variables 
export STORAGE_PROVIDER=azure 
export EMULATED=TRUE 
export AZURE_STORAGE_ACCOUNT=your-storage-account-name 
export AZURE_STORAGE_ACCESS_KEY=your-storage-access-key 
export AZURE_STORAGE_CONTAINER=your-container-name 
# Start the development server 
npm run dev
```

Make sure you have created an Azure Storage account and container, and have the necessary connection details.

Security Note: For production environments, consider using Azure Key Vault to store your storage access keys securely, and using managed identities for authentication instead of access keys where possible. 
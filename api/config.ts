import { defineConfig, StorageType, StorageConfig, DotaConfig } from "./config-utils";

// Determine which storage provider to use based on environment variables
function getStorageConfig(): StorageConfig {
  const storageProvider = process.env.STORAGE_PROVIDER || "local";

  switch(storageProvider.toLowerCase()) {
    case "azure":
      if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
        return {
          type: StorageType.AZURE,
          account: process.env.AZURE_STORAGE_ACCOUNT,
          accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
        };
      }
      console.warn("Azure storage environment variables missing, falling back to local storage");
      return { type: StorageType.LOCAL };
      
    case "aws":
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        return {
          type: StorageType.AWS,
          bucketName: process.env.S3_BUCKET_NAME,
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
      }
      console.warn("AWS storage environment variables missing, falling back to local storage");
      return { type: StorageType.LOCAL };
      
    case "local":
    default:
      return { 
        type: StorageType.LOCAL,
        path: process.env.LOCAL_STORAGE_PATH
      };
  }
}

const config: DotaConfig = defineConfig({
  storage: getStorageConfig(),
  cache: {
    type: "redis",
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379",
  }
});

export default config; 
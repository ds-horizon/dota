export enum StorageType {
  AWS = "aws",
  AZURE = "azure",
  LOCAL = "local"
}

export type StorageConfig =
  | {
      type: StorageType.AWS;
      bucketName?: string;
      region?: string;
      accessKeyId: string;
      secretAccessKey: string;
    }
  | {
      type: StorageType.AZURE;
      account: string;
      accessKey: string;
    }
  | {
      type: StorageType.LOCAL;
      path?: string;
    };

export type CacheConfig = {
  type: "redis";
  host: string;
  port: string;
};

export interface DotaConfig {
  storage: StorageConfig;
  cache: CacheConfig;
}

export function defineConfig(config: DotaConfig): DotaConfig {
  return config;
} 
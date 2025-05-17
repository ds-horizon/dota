#!/bin/bash

# --- DOTA Environment Generator ---
# This script generates .env files for DOTA based on CLI plugin options.
# It maps CLI flags to .env variables, validates combinations, and selects the correct template.

print_help() {
  cat <<EOF
Usage: ./generate-env.sh [OPTIONS]

Options:
  --storage=s3|azure|json|localstack   Storage backend (maps to STORAGE_PROVIDER)
  --cloudProvider=aws|azure           Cloud provider (selects template and restricts storage)
  --scope=local|prod                  Scope: local (dev) or prod (production)
  --database=mysql|postgres|azuredatatable  Database type (sets DB_HOST, DB_PORT, etc. for mysql/postgres; ignored for Azure Data Tables)
  --metrics=redis|redis-cluster       Metrics backend (sets Redis vars)
  --auth=google|passwordless          Auth method (sets Google OAuth or passwordless)
  --googleClientId=ID                 Google OAuth client ID (if using --auth=google)
  --googleClientSecret=SECRET         Google OAuth client secret (if using --auth=google)
  --redisCluster=true|false           Enable Redis cluster mode
  --dbHost=HOST                       Database host
  --dbPort=PORT                       Database port
  --dbUser=USER                       Database user
  --dbPassword=PASS                   Database password
  --dbName=NAME                       Database name
  --redisHost=HOST                    Redis host
  --redisPort=PORT                    Redis port
  --default                           Use all default values (local dev)
  --aws-local                         Shortcut: AWS, S3, local scope, MySQL, passwordless, single Redis
  --azure-local                       Shortcut: Azure, Azure storage, local scope, Azure Data Tables, passwordless, single Redis
  --aws-prod                          Shortcut: AWS, S3, prod scope, MySQL, Google OAuth, single Redis
  --azure-prod                        Shortcut: Azure, Azure storage, prod scope, Azure Data Tables, Google OAuth, single Redis
  --help                              Show this help message and exit

Shortcuts:
  --aws-local      → --cloudProvider=aws --storage=s3 --scope=local --database=mysql --metrics=redis --auth=passwordless
  --azure-local    → --cloudProvider=azure --storage=azure --scope=local --database=azuredatatable --metrics=redis --auth=passwordless
  --aws-prod       → --cloudProvider=aws --storage=s3 --scope=prod --database=mysql --metrics=redis --auth=google
  --azure-prod     → --cloudProvider=azure --storage=azure --scope=prod --database=azuredatatable --metrics=redis --auth=google

Mappings:
  --storage=s3|localstack   → STORAGE_PROVIDER=aws (only with --cloudProvider=aws)
  --storage=azure          → STORAGE_PROVIDER=azure (only with --cloudProvider=azure)
  --storage=json           → STORAGE_PROVIDER=json (local dev only)

Validation:
  - If --cloudProvider=aws, only --storage=s3 or --storage=localstack are allowed.
  - If --cloudProvider=azure, only --storage=azure is allowed.
  - If --storage=json, only allowed with --scope=local.
  - If --database=azuredatatable, MySQL/Postgres settings are ignored and Azure Data Tables are used for metadata.

Examples:
  ./generate-env.sh --aws-local
  ./generate-env.sh --aws-prod --googleClientId=xxx --googleClientSecret=yyy
  ./generate-env.sh --cloudProvider=azure --storage=azure --scope=local --database=azuredatatable --metrics=redis-cluster --auth=passwordless
  ./generate-env.sh --default
EOF
}

# --- Parse CLI Arguments (with help and shortcuts first) ---
for arg in "$@"; do
  if [[ "$arg" == "--help" ]]; then
    print_help
    exit 0
  fi
  if [[ "$arg" == "--aws-local" ]]; then
    SHORTCUT="aws-local"
  fi
  if [[ "$arg" == "--azure-local" ]]; then
    SHORTCUT="azure-local"
  fi
  if [[ "$arg" == "--aws-prod" ]]; then
    SHORTCUT="aws-prod"
  fi
  if [[ "$arg" == "--azure-prod" ]]; then
    SHORTCUT="azure-prod"
  fi
  # Remove shortcut from args so it doesn't get parsed again
  if [[ "$arg" == --aws-local || "$arg" == --azure-local || "$arg" == --aws-prod || "$arg" == --azure-prod ]]; then
    set -- "${@/ $arg/}"
  fi
  # Only one shortcut at a time
  if [[ -n "$SHORTCUT" ]]; then
    break
  fi
done

# Default values
STORAGE_PROVIDER=""
DATABASE="mysql"
AUTH="passwordless"
METRICS="redis"
COHORT="default"
RBAC="default"
CLOUD_PROVIDER="aws"
SCOPE="local"
TEMPLATE="env.aws.template"
REDIS_CLUSTER_ENABLED="false"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LOCAL_GOOGLE_TOKEN="mock-google-token"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="codepushdb"
REDIS_HOST="localhost"
REDIS_PORT="6379"

# --- Apply Shortcuts (override all other options) ---
if [[ "$SHORTCUT" == "aws-local" ]]; then
  CLOUD_PROVIDER="aws"
  STORAGE_PROVIDER="s3"
  SCOPE="local"
  DATABASE="mysql"
  METRICS="redis"
  AUTH="passwordless"
fi
if [[ "$SHORTCUT" == "azure-local" ]]; then
  CLOUD_PROVIDER="azure"
  STORAGE_PROVIDER="azure"
  SCOPE="local"
  DATABASE="azuredatatable"
  METRICS="redis"
  AUTH="passwordless"
fi
if [[ "$SHORTCUT" == "aws-prod" ]]; then
  CLOUD_PROVIDER="aws"
  STORAGE_PROVIDER="s3"
  SCOPE="prod"
  DATABASE="mysql"
  METRICS="redis"
  AUTH="google"
fi
if [[ "$SHORTCUT" == "azure-prod" ]]; then
  CLOUD_PROVIDER="azure"
  STORAGE_PROVIDER="azure"
  SCOPE="prod"
  DATABASE="azuredatatable"
  METRICS="redis"
  AUTH="google"
fi

# --- Parse CLI Arguments ---
while [[ $# -gt 0 ]]; do
  case $1 in
    --storage=*) STORAGE_PROVIDER="${1#*=}"; shift ;;
    --database=*) DATABASE="${1#*=}"; shift ;;
    --auth=*) AUTH="${1#*=}"; shift ;;
    --metrics=*) METRICS="${1#*=}"; shift ;;
    --cohort=*) COHORT="${1#*=}"; shift ;;
    --rbac=*) RBAC="${1#*=}"; shift ;;
    --cloudProvider=*) CLOUD_PROVIDER="${1#*=}"; shift ;;
    --scope=*) SCOPE="${1#*=}"; shift ;;
    --redisCluster=*) REDIS_CLUSTER_ENABLED="${1#*=}"; shift ;;
    --googleClientId=*) GOOGLE_CLIENT_ID="${1#*=}"; shift ;;
    --googleClientSecret=*) GOOGLE_CLIENT_SECRET="${1#*=}"; shift ;;
    --dbHost=*) DB_HOST="${1#*=}"; shift ;;
    --dbPort=*) DB_PORT="${1#*=}"; shift ;;
    --dbUser=*) DB_USER="${1#*=}"; shift ;;
    --dbPassword=*) DB_PASSWORD="${1#*=}"; shift ;;
    --dbName=*) DB_NAME="${1#*=}"; shift ;;
    --redisHost=*) REDIS_HOST="${1#*=}"; shift ;;
    --redisPort=*) REDIS_PORT="${1#*=}"; shift ;;
    --default)
      STORAGE_PROVIDER="json"
      DATABASE="mysql"
      AUTH="passwordless"
      METRICS="redis"
      COHORT="default"
      RBAC="default"
      CLOUD_PROVIDER="aws"
      SCOPE="local"
      shift ;;
    *) shift ;;
  esac
done

# --- Map and Validate Storage Provider ---
case "$STORAGE_PROVIDER" in
  s3|localstack)
    STORAGE_PROVIDER="aws"
    ;;
  azure)
    STORAGE_PROVIDER="azure"
    ;;
  json)
    STORAGE_PROVIDER="json"
    ;;
  "")
    STORAGE_PROVIDER="aws" # default
    ;;
  *)
    echo "[ERROR] Unsupported storage provider: $STORAGE_PROVIDER"; exit 1
    ;;
esac

# --- Cloud Provider Template Selection ---
case "$CLOUD_PROVIDER" in
  aws)
    TEMPLATE="env.aws.template"
    if [[ "$STORAGE_PROVIDER" != "aws" && "$STORAGE_PROVIDER" != "json" ]]; then
      echo "[ERROR] For cloudProvider=aws, only --storage=s3, --storage=localstack, or --storage=json are allowed."; exit 1
    fi
    ;;
  azure)
    TEMPLATE="env.azure.template"
    if [[ "$STORAGE_PROVIDER" != "azure" && "$STORAGE_PROVIDER" != "json" ]]; then
      echo "[ERROR] For cloudProvider=azure, only --storage=azure or --storage=json are allowed."; exit 1
    fi
    ;;
  *)
    echo "[ERROR] Unsupported cloud provider: $CLOUD_PROVIDER"; exit 1
    ;;
esac

# --- Additional Validation ---
if [[ "$STORAGE_PROVIDER" == "json" && "$SCOPE" != "local" ]]; then
  echo "[ERROR] --storage=json is only allowed with --scope=local."; exit 1
fi

# --- Scope, Emulated, and Node Env ---
if [ "$SCOPE" = "prod" ]; then
  EMULATED="false"
  NODE_ENV="production"
else
  EMULATED="true"
  NODE_ENV="development"
fi

# --- Database Mapping ---
case "$DATABASE" in
  mysql)
    DB_PORT="3306"
    DB_USER="root"
    DB_PASSWORD="root"
    DB_NAME="codepushdb"
    ;;
  postgres)
    DB_PORT="5432"
    DB_USER="postgres"
    DB_PASSWORD="postgres"
    DB_NAME="codepushdb"
    ;;
  azuredatatable)
    # Use defaults
    ;;
  *)
    # Use defaults
    ;;
esac

# --- Azure Storage: Skip MySQL Vars ---
if [[ "$STORAGE_PROVIDER" == "azure" ]]; then
  echo "Azure storage selected: MySQL is not required. Metadata will be stored in Azure Data Tables (or Azurite Table emulator in local mode)."
  DB_HOST=""
  DB_PORT=""
  DB_USER=""
  DB_PASSWORD=""
  DB_NAME=""
fi

# --- Metrics (Redis) ---
if [[ "$METRICS" == "redis-cluster" || "$REDIS_CLUSTER_ENABLED" == "true" ]]; then
  REDIS_CLUSTER_ENABLED="true"
else
  REDIS_CLUSTER_ENABLED="false"
fi

# --- Auth Mapping ---
if [ "$AUTH" = "google" ]; then
  # If not provided, set placeholders
  if [ -z "$GOOGLE_CLIENT_ID" ]; then
    GOOGLE_CLIENT_ID="your-google-client-id"
  fi
  if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
  fi
  LOCAL_GOOGLE_TOKEN=""
else
  # passwordless
  LOCAL_GOOGLE_TOKEN="mock-google-token"
  GOOGLE_CLIENT_ID=""
  GOOGLE_CLIENT_SECRET=""
fi

# --- Generate .env from Template ---
cp "$TEMPLATE" .env

# --- Replace Variables in .env ---
if [[ "$STORAGE_PROVIDER" != "azure" ]]; then
  sed -i '' "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" .env
  sed -i '' "s/^DB_PORT=.*/DB_PORT=$DB_PORT/" .env
  sed -i '' "s/^DB_USER=.*/DB_USER=$DB_USER/" .env
  sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
  sed -i '' "s/^DB_NAME=.*/DB_NAME=$DB_NAME/" .env
fi
sed -i '' "s/^STORAGE_PROVIDER=.*/STORAGE_PROVIDER=$STORAGE_PROVIDER/" .env
sed -i '' "s/^NODE_ENV=.*/NODE_ENV=$NODE_ENV/" .env
sed -i '' "s/^EMULATED=.*/EMULATED=$EMULATED/" .env
sed -i '' "s/^REDIS_HOST=.*/REDIS_HOST=$REDIS_HOST/" .env
sed -i '' "s/^REDIS_PORT=.*/REDIS_PORT=$REDIS_PORT/" .env

# Metrics/Redis cluster
if grep -q '^REDIS_CLUSTER_ENABLED=' .env; then
  sed -i '' "s/^REDIS_CLUSTER_ENABLED=.*/REDIS_CLUSTER_ENABLED=$REDIS_CLUSTER_ENABLED/" .env
else
  echo "REDIS_CLUSTER_ENABLED=$REDIS_CLUSTER_ENABLED" >> .env
fi

# Auth
if [ -n "$GOOGLE_CLIENT_ID" ]; then
  if grep -q '^GOOGLE_CLIENT_ID=' .env; then
    sed -i '' "s/^GOOGLE_CLIENT_ID=.*/GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID/" .env
  else
    echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
  fi
fi
if [ -n "$GOOGLE_CLIENT_SECRET" ]; then
  if grep -q '^GOOGLE_CLIENT_SECRET=' .env; then
    sed -i '' "s/^GOOGLE_CLIENT_SECRET=.*/GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET/" .env
  else
    echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
  fi
fi
if [ -n "$LOCAL_GOOGLE_TOKEN" ]; then
  if grep -q '^LOCAL_GOOGLE_TOKEN=' .env; then
    sed -i '' "s/^LOCAL_GOOGLE_TOKEN=.*/LOCAL_GOOGLE_TOKEN=$LOCAL_GOOGLE_TOKEN/" .env
  else
    echo "LOCAL_GOOGLE_TOKEN=$LOCAL_GOOGLE_TOKEN" >> .env
  fi
fi

# RBAC, COHORT (default for now)
if grep -q '^RBAC_PROVIDER=' .env; then
  sed -i '' "s/^RBAC_PROVIDER=.*/RBAC_PROVIDER=$RBAC/" .env
else
  echo "RBAC_PROVIDER=$RBAC" >> .env
fi
if grep -q '^COHORTING_STRATEGY=' .env; then
  sed -i '' "s/^COHORTING_STRATEGY=.*/COHORTING_STRATEGY=$COHORT/" .env
else
  echo "COHORTING_STRATEGY=$COHORT" >> .env
fi

# Cloud provider
if grep -q '^CLOUD_PROVIDER=' .env; then
  sed -i '' "s/^CLOUD_PROVIDER=.*/CLOUD_PROVIDER=$CLOUD_PROVIDER/" .env
else
  echo "CLOUD_PROVIDER=$CLOUD_PROVIDER" >> .env
fi

# Scope
if grep -q '^SCOPE=' .env; then
  sed -i '' "s/^SCOPE=.*/SCOPE=$SCOPE/" .env
else
  echo "SCOPE=$SCOPE" >> .env
fi

# --- Copy to api/.env and web/.env ---
cp .env api/.env 2>/dev/null || true
cp .env web/.env 2>/dev/null || true

echo "✅ Environment files generated from $TEMPLATE with selected plugin options." 
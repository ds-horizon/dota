enum EnvArgs {
  GITHUB_TOKEN = "GITHUB_TOKEN",
  GITHUB_OWNER = "GITHUB_OWNER",
  GITHUB_REPO = "GITHUB_REPO",
  GITHUB_WEBHOOK_SECRET = "GITHUB_WEBHOOK_SECRET",
  GITHUB_SENDER_LOGIN = "GITHUB_SENDER_LOGIN",
  SLACK_TOKEN = "SLACK_TOKEN",
  GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID",
  GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET",
  AWS_S3_BUCKET = "AWS_S3_BUCKET",
  aws_secret_access_key = "aws_secret_access_key",
  aws_access_key_id = "aws_access_key_id",
  CODEPUSH_SERVER_URL = "CODEPUSH_SERVER_URL",
}

type TEnv = Record<EnvArgs, string>;

const initialValue: TEnv = {
  [EnvArgs.GITHUB_TOKEN]: "",
  [EnvArgs.GITHUB_OWNER]: "",
  [EnvArgs.GITHUB_REPO]: "",
  [EnvArgs.GITHUB_WEBHOOK_SECRET]: "",
  [EnvArgs.GITHUB_SENDER_LOGIN]: "",
  [EnvArgs.SLACK_TOKEN]: "",
  [EnvArgs.GOOGLE_CLIENT_ID]: "",
  [EnvArgs.GOOGLE_CLIENT_SECRET]: "",
  [EnvArgs.AWS_S3_BUCKET]: "",
  [EnvArgs.aws_secret_access_key]: "",
  [EnvArgs.aws_access_key_id]: "",
  [EnvArgs.CODEPUSH_SERVER_URL]: "",
};

const makeConfig = (): TEnv => {
  let initial = "";
  if (process.env.DEPLOYMENT === "production") {
    initial = "VAULT_SERVICE_";
  }

  return Object.keys(EnvArgs).reduce((prev, curr) => {
    return { ...prev, [curr]: process.env[`${initial}${curr}`] ?? "" };
  }, initialValue);
};

export const env: TEnv = makeConfig();

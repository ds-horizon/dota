import fs from "fs-extra";
import path from "path";

const __dirname = process.env.INIT_CWD ?? "";

const genConfigFile = async () => {
  const version = fs
    .readFileSync(
      path.join(__dirname, ".odin/cp-web-dashboard/application-spec.yml")
    )
    .toString()
    .split(" ")[1]
    .split("-")[0];

  fs.writeFileSync(
    path.join(__dirname, "app/config.json"),
    JSON.stringify({ version }, null, 2)
  );
};

genConfigFile();

import fs from "fs-extra";
import path from "path";

const __dirname = process.env.INIT_CWD ?? "";

const genConfigFile = async () => {
  // Using a constant version for development
  const version = "1.0.0";

  fs.writeFileSync(
    path.join(__dirname, "app/config.json"),
    JSON.stringify({ version }, null, 2)
  );
};

genConfigFile();

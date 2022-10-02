import * as dotenv from "dotenv";
import * as path from "path";

export const loadEnv = () => {
  const envPath = path.join(__dirname, "..", "..", ".env");
  dotenv.config({ path: envPath });
};

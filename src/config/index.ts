import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTION_STRING as string,
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET as string,
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
};

export default config;
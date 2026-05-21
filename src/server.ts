import app from "./app";
import config from "./config";
import { initDB } from "./db/db";

const main = async () => {
  await initDB();
  app.listen(config.port, () => {
    console.log(`DevPulse running on the port ${config.port}`);
  });
};

main();

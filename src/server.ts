import express, { type Application, type Request, type Response } from "express";
import config from "./config";
import { initDB } from "./db/db";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, DevPulse!", author: "Robin" });
});

app.listen(config.port, () => {
  initDB();
  console.log(`DevPulse running on port ${config.port}`);
});

import express, { type Application } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "DevPulse API running" });
});


app.use("/api/auth", authRouter);

export default app;
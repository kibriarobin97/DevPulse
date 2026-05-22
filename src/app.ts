import express, { type Application } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issues/issues.route";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "DevPulse server running",
    author: "Robin",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRoutes);

export default app;

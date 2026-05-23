import express, { type Application } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import type { Request, Response } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  res.json({
    message: "DevPulse server running",
    author: "Robin",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRoutes);

app.all("*all", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;

import express from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issues.controller";

const router = express.Router();

router.get("/", issueController.getAllIssues);

router.get("/:id", issueController.getSingleIssue);

router.post("/", auth(), issueController.createIssue);

router.patch("/:id", auth(), issueController.updateIssue);

router.delete("/:id", auth("maintainer"), issueController.deleteIssue);

export const issueRoutes = router;
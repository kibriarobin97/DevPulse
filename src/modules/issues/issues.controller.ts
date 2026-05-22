import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";
import type { Request, Response } from "express";



const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user.id;
    const result = await issueService.createIssueIntoDB(req.body, reporterId);

    
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create issue",
      error: error.message,
    });
  }
};


const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fetched successfully", 
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch issues",
      error: error.message,
    });
  }
};


const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
        error: "Issue not found",
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      message: "Issue fetched successfully",
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch issue",
      error: error.message,
    });
  }
};


const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; 
    const userRole = req.user.role;

    const result = await issueService.updateIssueIntoDB(id as string, req.body, userId, userRole);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    
    if (error.message === "NOT_FOUND") {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
        error: "Issue not found",
      });
      return;
    }

    if (error.message === "FORBIDDEN") {
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Valid token but insufficient role/permissions",
        error: "You can only update your own issue",
      });
      return;
    }

    if (error.message === "CONFLICT") {
      sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Business logic conflict",
        error: "You can only update open issues",
      });
      return;
    }

    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update issue",
      error: error.message,
    });
  }
};


const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    await issueService.deleteIssueFromDB(id as string, userRole);

   
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
        error: "Issue not found",
      });
      return;
    }

    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete issue",
      error: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
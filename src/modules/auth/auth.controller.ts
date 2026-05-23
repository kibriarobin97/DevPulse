import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signupUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.signupUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "Email already exists") {
      sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Business logic conflict",
        error: "Email already exists",
      });
      return;
    }
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Bad Request",
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "User not found!") {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
        error: "User not found!",
      });
      return;
    }

    if (error.message === "Invalid password!") {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Missing, expired, or invalid JWT token",
        error: "Invalid password!",
      });
      return;
    }
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message || "Login failed",
      error: error,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};

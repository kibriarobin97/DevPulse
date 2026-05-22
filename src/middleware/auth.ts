import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db/db";
import type { AuthRequest } from "../type";

const auth = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
       const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
        return;
      }

      // verify the token
      const decodedToken = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      // check if the user exists in database
      const userData = await pool.query(`SELECT * FROM users WHERE id=$1`, [
        decodedToken.id,
      ]);
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

      const user = userData.rows[0];

      // check role permission
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this.",
        });
        return;
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({
         success: false,
        message: "Invalid token!",
      });
    }
  };
};

export default auth;

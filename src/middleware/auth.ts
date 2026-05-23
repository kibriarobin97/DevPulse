import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Missing, expired, or invalid JWT token",
          error: "Unauthorized access",
        });
        return;
      }

      const decodedToken = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as { id: number; name: string; role: string };

      // check if the user exists in database
      const userData = await pool.query(`SELECT * FROM users WHERE id=$1`, [
        decodedToken.id,
      ]);
      
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "Requested resource does not exist",
          error: "User not found!",
        });
        return;
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Valid token but insufficient role/permissions",
          error: "Forbidden access",
        });
        return;
      }

      req.user = {
        id: decodedToken.id,
        name: decodedToken.name,
        role: decodedToken.role,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Missing, expired, or invalid JWT token",
        error: "Invalid token!",
      });
    }
  };
};

export default auth;
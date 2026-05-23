import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
  created_at: Date;
  updated_at: Date;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignup {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}


export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IUpdateIssue {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}
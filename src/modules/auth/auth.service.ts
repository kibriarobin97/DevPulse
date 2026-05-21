
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../../db/db";
import config from "../../config";
import type { ISignupPayload, ILoginPayload } from "../../type";

const signupUserIntoDB = async (payload: ISignupPayload) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email=$1`,
    [email],
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

 
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  
  const result = await pool.query(
    `INSERT INTO users(name, email, password, role)
     VALUES($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const loginUserIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials");
  }
  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
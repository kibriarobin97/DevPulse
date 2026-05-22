import { pool } from "../../db/db";
import type { ICreateIssue } from "../../type";

const createIssue = async (payload: ICreateIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues(title, description, type, reporter_id)
     VALUES($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};
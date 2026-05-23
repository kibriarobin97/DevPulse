import { pool } from "../../db/db";
import type { ICreateIssue, IUpdateIssue } from "../../type";

const createIssueIntoDB = async (payload: ICreateIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues(title, description, type, reporter_id)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporterId],
  );
  const newIssue = result.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [reporterId],
  );

  const finalResponse = {
    ...newIssue,
    reporter: reporterResult.rows[0] || null,
  };

  return { rows: [finalResponse] };
};

const getAllIssuesFromDB = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort, type, status } = query;

  let sqlQuery = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];
  let index = 1;

  if (type) {
    conditions.push(`type=$${index}`);
    values.push(type);
    index++;
  }

  if (status) {
    conditions.push(`status=$${index}`);
    values.push(status);
    index++;
  }

  if (conditions.length > 0) {
    sqlQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  sqlQuery += ` ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

  const result = await pool.query(sqlQuery, values);
  const issues = result.rows;

  if (issues.length === 0) {
    return { rows: [] };
  }

  const usersResult = await pool.query(`SELECT id, name, role FROM users`);
  const allUsers = usersResult.rows;

  const issuesWithReporter = [];

  for (let i = 0; i < issues.length; i++) {
    const currentIssue = issues[i];
    let foundReporter = null;

    for (let j = 0; j < allUsers.length; j++) {
      if (allUsers[j].id === currentIssue.reporter_id) {
        foundReporter = allUsers[j];
        break;
      }
    }

    issuesWithReporter.push({
      ...currentIssue,
      reporter: foundReporter,
    });
  }

  return { rows: issuesWithReporter };
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return result;
  }

  const issue = result.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [issue.reporter_id],
  );

  const finalIssue = {
    ...issue,
    reporter: reporterResult.rows[0] || null,
  };

  return { rows: [finalIssue] };
};

const updateIssueIntoDB = async (
  id: string,
  payload: IUpdateIssue,
  userId: number,
  userRole: string,
) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw new Error("NOT_FOUND");
  }

  const issue = issueResult.rows[0];

  if (userRole === "contributor") {
    if (issue.reporter_id !== userId) {
      throw new Error("FORBIDDEN");
    }
  }
  if (issue.status === "resolved") {
    throw new Error("CONFLICT");
  }
  if (issue.status === "in_progress" && payload.status === "open") {
    throw new Error("CONFLICT");
  }

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues 
    SET 
      title=COALESCE($1, title),
      description=COALESCE($2, description),
      type=COALESCE($3, type),
      status=COALESCE($4, status),
      updated_at=NOW()
    WHERE id=$5
    RETURNING *
    `,
    [
      title !== undefined ? title : null,
      description !== undefined ? description : null,
      type !== undefined ? type : null,
      status !== undefined ? status : null,
      id,
    ],
  );

  const updatedIssue = result.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [updatedIssue.reporter_id],
  );

  const finalUpdatedIssue = {
    ...updatedIssue,
    reporter: reporterResult.rows[0] || null,
  };

  return { rows: [finalUpdatedIssue] };
};

const deleteIssueFromDB = async (id: string, userRole: string) => {
  const checkResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  if (checkResult.rows.length === 0) {
    throw new Error("NOT_FOUND");
  }
  if (userRole !== "maintainer") {
    throw new Error("FORBIDDEN");
  }
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1 RETURNING id
    `,
    [id],
  );

  return result;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};

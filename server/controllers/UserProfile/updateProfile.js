import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { getUserWithID, usernameExistsChecker } from "../../database.js";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSW,
  database: process.env.DB,
});

export async function updateProfile(
  fullname,
  username,
  bio,
  acc_private,
  userId
) {
  try {
    const conn = await pool.getConnection();
    const usernameQ = await pool.query(
      `SELECT username FROM users WHERE _id = ?`,
      [userId]
    );
    const usernameInUse =
      usernameQ[0][0].username !== username
        ? await usernameExistsChecker(username)
        : false;

    if (usernameInUse) return { name: "username", status: "taken" };

    const result = await conn.query(
      `
          UPDATE users SET fullname = ?, username = ?, bio = ?, private = ? WHERE _id = ?
      `,
      [fullname, username, bio, acc_private, userId]
    );

    if (result) {
      const user = await getUserWithID(userId);
      pool.releaseConnection(conn);
      return user;
    }
  } catch (error) {
    console.log("updateProfile | server: ", error.message);
  }
}

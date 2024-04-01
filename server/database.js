import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSW,
    database: process.env.DB,
  })
  .promise();

export async function getUsers() {
  const [result] = await pool.query("SELECT * FROM users");
  return result;
}

// const users = await getUsers();
// console.log(users);

export async function getUserWithID(id) {
  const [result] = await pool.query(
    `SELECT _id, fullname, email, username, recipe_count, following_count, follower_count FROM users WHERE _id = ?`,
    [id]
  );
  return result[0];
}

// const user = await getUserWithID(1);
// console.log(user);

// create user
export async function registerUser(fullname, email, username, password) {
  // hash password
  const result = await pool.query(
    `
        INSERT INTO users (fullname, email, username, password)
        VALUES (?, ?, ?, ?)
    `,
    [fullname, email, username, password]
  );
  const new_id = result.insertId;
  const query = getUserWithID(new_id);
  return query;
}

export async function loginUser(username, password) {
  const login = await pool.query(
    `
    SELECT _id, username, password FROM users WHERE username = ?;
    `,
    [username]
  );
  const result = login[0][0];
  const hashMatch = await bcrypt.compare(password, result.password);

  if (!hashMatch) {
    return "Incorrect password. Try again";
  }
  return await getUserWithID(result._id);
}

// check if email exists
export async function emailExistsChecker(email) {
  const emailExists = await pool.query(
    `
    SELECT email FROM users WHERE email = ?
  `,
    [email]
  );
  if (emailExists.length > 0) return true;
  else return false;
}

export async function usernameExistsChecker(username) {
  const emailExists = await pool.query(
    `
    SELECT username FROM users WHERE username = ?
  `,
    [username]
  );
  if (emailExists.length > 0) return true;
  else return false;
}

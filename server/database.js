import mysql from "mysql2";
import dotenv from "dotenv";
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
  const [result] = await pool.query(`SELECT * FROM users WHERE _id = ?`, [id]);
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

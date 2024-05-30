import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { getAllergies } from "./allergies.js";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSW,
  database: process.env.DB,
});

export async function fetchProfile(req, res) {
  const userId = req.user.id;
  try {
    const query = await pool.query(
      `
        SELECT _id, fullname, email, username, profilePicture, bio, recipe_count, following_count, follower_count, private FROM users WHERE _id = ?   
    `,
      [userId]
    );

    const allergies = await getAllergies({ user: { id: userId } });

    query[0][0].allergies = [...allergies];

    if (query[0][0]._id) {
      res.status(201).send(query[0][0]);
    }
  } catch (error) {
    console.log(error);
    console.log("Cannot find data");
    res.status(401);
  }
}

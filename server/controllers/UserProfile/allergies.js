import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSW,
  database: process.env.DB,
});

export async function getAllergies(req) {
  const userId = req.user.id;
  try {
    const allergies = await pool.query(
      `
        SELECT allergy from allergies WHERE user_id = ? AND removed = 0
      `,
      [userId]
    );

    let allergyList = [];
    for (let i = 0; i < allergies[0].length; i++) {
      allergyList.push(allergies[0][i].allergy);
    }

    return allergyList;
    //
  } catch (error) {
    console.log(error);
    return "Allergies not found.";
  }
}

export async function addAllergies(req, res) {
  const userId = req.user.id;
  const allergies = req.body.allergies;
  try {
    for (let i = 0; i < allergies.length; i++) {
      if (allergies[i] === "") {
        continue;
      }
      await pool
        .query(
          `
              INSERT INTO allergies (user_id, allergy)
              VALUES (?, ?) 
          `,
          [userId, allergies[i]]
        )
        .then((response) => {
          if (response[0]) {
            return res
              .status(201)
              .send({ message: "Added allergy successfully" });
          }
        });
    }
  } catch (error) {
    console.log("addAllergy: ", error);
    return "Error adding your allergies";
  }
}

export async function removeAllergies(req, res) {
  const userId = req.user.id;
  const allergies = req.body.allergies;
  try {
    for (let i = 0; i < allergies.length; i++) {
      if (allergies[i] === "") {
        continue;
      }
      await pool
        .query(
          `
            UPDATE allergies SET removed = 1 WHERE user_id = ? AND allergy = ?
          `,
          [userId, allergies[i]]
        )
        .then((response) => {
          if (response[0]) {
            return res
              .status(201)
              .send({ message: "Removed allergy successfully" });
          }
        });
    }
  } catch (error) {
    console.log(error);
    return "Error removing your allergy";
  }
}

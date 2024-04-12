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
    `SELECT _id, fullname, email, username, profilePicture, recipe_count, following_count, follower_count FROM users WHERE _id = ?`,
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

export async function updateProfilePicture(id, image_url) {
  const result = await pool.query(
    `
      UPDATE users SET profilePicture = ? WHERE _id = ?
    `,
    [image_url, id]
  );
  if (result) {
    const user = getUserWithID(id);
    return user;
  }
}

export async function loginUser(username, password) {
  const login = await pool.query(
    `
    SELECT _id, username, password FROM users WHERE username = ?;
    `,
    [username]
  );
  const result = login[0][0];

  if (!result) {
    return `User ${username} does not exist.`;
  }

  const hashMatch = await bcrypt.compare(password, result.password);

  if (!hashMatch) {
    return "Incorrect password. Try again";
  }
  return await getUserWithID(result._id);
}

// add recipe
export async function addRecipe(recipe) {
  const recipeInsert = await pool.query(
    `
    INSERT INTO recipes (recipe_name, description, preparation_time, preparation_unit, cooking_time, cooking_unit, servings, user_id) VALUES (?,?,?,?,?,?,?,?)
    `,
    [
      recipe.recipeName,
      recipe.description,
      recipe.prepTime.time,
      recipe.prepTime.unit,
      recipe.cookTime.time,
      recipe.cookTime.unit,
      recipe.servings,
      recipe.userId,
    ]
  );

  const result = recipeInsert;
  const recipeId = result[0].insertId;
  return recipeId;
}

export async function updateRecipeImageURL(recipeId, url) {
  const result = await pool.query(
    `
      UPDATE recipes SET image = ? WHERE _id = ?
    `,
    [url, recipeId]
  );
  if (result) {
    return true;
  }
}
export async function getRecipesOfUser(id) {
  const result = await pool.query(
    `
    SELECT * FROM recipes WHERE user_id = ?
    `,
    [id]
  );

  return result;
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

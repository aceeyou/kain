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
  console.log(email);
  const result = await pool.query(
    `
        INSERT INTO users (fullname, email, username, password)
        VALUES (?, ?, ?, ?)
    `,
    [fullname, email, username, password]
  );
  const new_id = result[0].insertId;
  const query = await getUserWithID(new_id);
  if (query) {
    return query;
  }
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
    return { error: `User ${username} does not exist.` };
  }

  const hashMatch = await bcrypt.compare(password, result.password);

  if (!hashMatch) {
    return { error: "Incorrect password. Try again" };
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
  if (result) {
    // update recipe_count on user's profile
    await addRecipeCount(recipe.userId);
    const recipeId = result[0].insertId;
    return recipeId;
  }
}

async function addRecipeCount(userId) {
  const recipeCountQuery = await pool.query(
    `
      UPDATE users SET recipe_count = recipe_count + 1 WHERE _id = ?
    `,
    [userId]
  );
  if (recipeCountQuery) return true;
  return false;
}

export async function setRecipeIngredients(recipeId, ingredients) {
  try {
    for (let i = 0; i < ingredients.length; i++) {
      await pool.query(
        `
            INSERT INTO ingredients (recipe_id, ingredient, quantity, unit) VALUES (?, ?, ?, ?)
          `,
        [
          recipeId,
          ingredients[i].ingredient,
          Number(ingredients[i].quantity),
          ingredients[i].unit,
        ]
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function setRecipeSteps(recipeId, steps) {
  steps?.map(async (step) => {
    try {
      await pool.query(
        `
        INSERT INTO steps (recipe_id, step) VALUES (?, ?)
        `,
        [recipeId, step]
      );
    } catch (error) {
      console.log(error);
    }
  });
}

export async function getRecipeOfId(id) {
  const recipe = await pool.query(
    `
      SELECT * FROM recipes WHERE _id = ?
    `,
    [id]
  );

  if (recipe) return recipe[0];
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

export async function getIngredientsForRecipe(id) {
  const result = await pool.query(
    `
      SELECT * FROM ingredients WHERE recipe_id = ?
    `,
    [id]
  );
  if (!!result[0]) return result[0];
}

export async function getStepsForRecipe(id) {
  const result = await pool.query(
    `
      SELECT * FROM steps WHERE recipe_id = ?
    `,
    [id]
  );
  if (!!result[0]) return result[0];
}

// check if email exists
export async function emailExistsChecker(email) {
  const emailExists = await pool.query(
    `
    SELECT email FROM users WHERE email = ?
  `,
    [email]
  );
  console.log(emailExists[0]);
  if (emailExists[0].length > 0) return true;
  return false;
}

export async function usernameExistsChecker(username) {
  const usernameExists = await pool.query(
    `
    SELECT username FROM users WHERE username = ?
  `,
    [username]
  );
  if (usernameExists[0].length > 0) return true;
  else return false;
}

import { pool } from "../index.js";

export async function fetchRecipes(_, res) {
  try {
    const recipes = await pool.query(
      "SELECT recipes._id, recipes.recipe_name, recipes.image, recipes.user_id, users.username AS recipe_owner FROM recipes INNER JOIN users ON recipes.user_id = users._id WHERE recipes.private = 0 AND recipes.account_private = 0"
    );

    console.log(recipes);
    if (recipes[0].length > 0) return res.status(201).send(recipes[0]);
    //
  } catch (error) {
    console.log(error);
    res.status(409);
  }
}

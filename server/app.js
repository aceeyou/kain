import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinary from "cloudinary";

import {
  getUsers,
  getUserWithID,
  registerUser,
  loginUser,
  emailExistsChecker,
  usernameExistsChecker,
  updateProfilePicture,
  addRecipe,
  updateRecipeImageURL,
  getRecipesOfUser,
  setRecipeIngredients,
  setRecipeSteps,
  getRecipeOfId,
  getIngredientsForRecipe,
  getStepsForRecipe,
  getAllRecipes,
} from "./database.js";

import { updateProfile } from "./controllers/UserProfile/updateProfile.js";
import { fetchProfile } from "./controllers/UserProfile/profile.js";
import {
  addAllergies,
  removeAllergies,
} from "./controllers/UserProfile/allergies.js";
import { fetchRecipes } from "./controllers/recipes/RecipesPublic.js";

// import { cloudinary } from "./helpers/cloudinary";

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function hashPassword(pw) {
  const saltRounds = Number(process.env.SALT);
  let hashed = await bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(pw, salt);
    })
    .then((hash) => hash)
    .catch((err) => console.log(err.message));
  return hashed;
}

async function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (token === null || token === undefined) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      next();
    });
  } catch (error) {
    res.sendStatus(401);
    console.log("error");
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUserWithID(id);
  res.send(user);
});

app.post("/register", async (req, res) => {
  const { fullname, email, username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    if (!(fullname && email && username && password)) {
      console.log("field should be filled");
      res.status(409).send("All fileds should be filled");
      return;
    }
    if (await emailExistsChecker(email)) {
      res.status(409).send({
        field: "email",
        message: "This email address has been taken",
      });
      return;
    } else {
      if (await usernameExistsChecker(username)) {
        res.status(409).send({
          field: "username",
          message: "This username has been taken",
        });
        return;
      }
    }

    const register = await registerUser(
      fullname,
      email,
      username,
      hashedPassword
    );
    if (register) {
      res.status(201).send(register);
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const isUsernameExists = await usernameExistsChecker(username);

  // Check if username exists in the user database
  if (!isUsernameExists)
    return res.status(401).send(`User ${username} does not exist`);

  // if username exists, try to login
  const user = await loginUser(username, password);
  if (!!user.error) {
    return res.status(401).send(user.error);
  }
  const userToken = {
    id: user._id,
    username: username,
  };

  // jwt token
  if (user.username === username) {
    const accessToken = generateAccessToken(userToken);
    const refreshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET);
    // await updateUserAccessToken(user._id, accessToken);

    //
    // DONT MOVE CODE BELOW
    //

    // send token to cookie-parser
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json(user);
  }
});

app.get("/profile", authenticateToken, fetchProfile);
app.post("/add-allergies", authenticateToken, addAllergies);
app.post("/remove-allergies", authenticateToken, removeAllergies);

app.post("/uploadProfilePicture", authenticateToken, async (req, res) => {
  let { userId, image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "chdu8p2z",
    });

    if (result) {
      const update = await updateProfilePicture(userId, result.secure_url);
      res.status(200).send(update);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/addrecipe", authenticateToken, async (req, res) => {
  const {
    recipeName,
    image,
    prepTime,
    cookTime,
    servings,
    description,
    ingredients,
    instructions,
  } = req.body;

  try {
    const result = await addRecipe({
      recipeName,
      description,
      prepTime,
      cookTime,
      servings,
      userId: req.user.id,
    });

    if (result) {
      const recipeImageUpload = await cloudinary.uploader.upload(image, {
        upload_preset: "chdu8p2z",
      });

      console.log(await recipeImageUpload);

      // update recipe image
      if (recipeImageUpload) {
        await updateRecipeImageURL(result, recipeImageUpload.secure_url);
      }

      // setting invidual ingredient to the database
      await setRecipeIngredients(result, ingredients);
      // setting invidual step to the database
      await setRecipeSteps(result, instructions);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/recipes", authenticateToken, fetchRecipes);

app.get("/recipes/:id", authenticateToken, async (req, res) => {
  const result = await getRecipesOfUser(req.params.id);
  const sendBack = result[0];

  res.send(sendBack);
});

app.get("/recipe/:id", authenticateToken, async (req, res) => {
  try {
    const result = await getRecipeOfId(req.params.id);
    if (result) res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/recipe/ingredients/:id", authenticateToken, async (req, res) => {
  try {
    const result = await getIngredientsForRecipe(req.params.id);
    if (result) res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/recipe/steps/:id", authenticateToken, async (req, res) => {
  try {
    const result = await getStepsForRecipe(req.params.id);
    if (result) res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/usernamechecker", async (req, res) => {
  try {
    const result = await usernameExistsChecker(req.body.username);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/profile/update-profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { fullname, username, bio, acc_private } = req.body;
  // update profile logic
  const result = await updateProfile(
    fullname,
    username,
    bio,
    acc_private,
    userId
  );
  if (result) {
    if (result.status === "taken") return res.status(409).send(result);
    return res.send(result);
  }
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

import express from "express";
import bcrypt, { hash } from "bcrypt";
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
} from "./database.js";

// import { cloudinary } from "./helpers/cloudinary";

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

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
  console.log("cookie token: ", token);
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
  // console.log("Register | Password-: ", hashedPassword);
  try {
    if (!(fullname && email && username && password)) {
      res.status(400).send("All fileds should be filled");
    }
    if (emailExistsChecker(email)) res.status(403).send("Email already in use");

    if (usernameExistsChecker(username))
      res.status(403).send("Username already taken");

    const register = await registerUser(
      fullname,
      email,
      username,
      hashedPassword
    );
    res.status(201).send(register);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);
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

app.get("/profile", authenticateToken, async (req, res) => {
  const user = await getUserWithID(req.user.id);
  console.log(user);
  res.send(user);
});

app.post("/uploadProfilePicture", authenticateToken, async (req, res) => {
  let { userId, image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "kainuploads",
    });

    if (result) {
      const update = await updateProfilePicture(userId, result.secure_url);
      res.status(200).send(update);
    }
  } catch (error) {
    console.log(error);
  }
});

// app.get("/recipes", authenticateToken, (req, res) => {});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

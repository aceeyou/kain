import express from "express";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import {
  getUsers,
  getUserWithID,
  registerUser,
  loginUser,
  emailExistsChecker,
  usernameExistsChecker,
} from "./database.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

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
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const jwt = req.cookies.jwt;
  console.log("cookie token: ", jwt);
  if (jwt == null) return res.sendStatus(401);

  jwt.verify(jwt, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    console.log("authorized");
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-origin", "*");
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
  if (user) {
    const accessToken = generateAccessToken(userToken);
    const refreshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET);
    // await updateUserAccessToken(user._id, accessToken);
    user.token = accessToken;
    user.refreshToken = refreshToken;

    // send token to cookie-parser
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("jwt", accessToken, options);
    res.cookie("user_id", user._id, options);
    res.status(201).json(user);
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  const id = req.cookies.user_id;
  const user = await getUserWithID(id);
  console.log("profile user: ", id);
  res.json(user);
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

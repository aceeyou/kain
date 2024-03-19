import express from "express";
import { getUsers, getUserWithID, registerUser } from "./database.js";

const app = express();
app.use(express.json());

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
  const register = await registerUser(fullname, email, username, password);
  res.status(201).send(register);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

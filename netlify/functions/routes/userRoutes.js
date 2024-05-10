import { Router } from "express";
import { authenticate, register } from "../services/userServices.js";

const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const result = await register(username, password, role);

  res.json(result);
});

userRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticate(username, password);

  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ message: "Username or password is incorrect" });
  }
});

userRoutes.post("/logout", (req, res) => {
  // In a stateless authentication mechanism like JWT, logging out can be handled on the client side
  // When a user logs out, you simply need to destroy the token on the client side
  res.json({ message: "Logged out successfully" });
});

export default userRoutes;

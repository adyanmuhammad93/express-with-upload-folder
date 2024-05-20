import { Router } from "express";
import {
  authenticate,
  deleteUser,
  getAllUsers,
  getUserById,
  register,
  updateUser,
} from "../services/userServices.js";

const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  const { username, password, role, privileges } = req.body;
  const result = await register(username, password, role, privileges);

  res.json(result);
});

userRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authenticate(username, password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRoutes.post("/logout", (req, res) => {
  // In a stateless authentication mechanism like JWT, logging out can be handled on the client side
  // When a user logs out, you simply need to destroy the token on the client side
  res.json({ message: "Logged out successfully" });
});

userRoutes.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRoutes.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRoutes.put("/users/:id", async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRoutes.delete("/users/:id", async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default userRoutes;

import db from "../db.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = "something-like-this"; // Replace with your actual secret key

const authenticate = async (username, password) => {
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];

    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ sub: user.id, role: user.role }, SECRET_KEY, {
          expiresIn: "1h",
        });
        return { ...user, token };
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("Username does not exist");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const register = async (username, password, role) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );

    if (result.affectedRows > 0) {
      return { message: "User registered successfully" };
    }

    return { message: "Registration failed" };
  } catch (error) {
    console.log(error);
  }
};

export { authenticate, register };

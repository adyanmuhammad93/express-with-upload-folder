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
        const token = jwt.sign({ sub: user.id, role: user.role }, SECRET_KEY);
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

const register = async (username, password, role, privileges) => {
  console.log(privileges);
  try {
    const defaultPrivileges = {
      berita: false,
      laporanTahunan: false,
      majalah: false,
      penghargaan: false,
      slider: false,
    };

    // If privileges are not provided, use the default privileges
    const finalPrivileges = privileges || defaultPrivileges;

    const [result] = await db.execute(
      "INSERT INTO users (username, password, role, privileges) VALUES (?, ?, ?, ?)",
      [username, password, role, JSON.stringify(finalPrivileges)]
    );

    if (result.affectedRows > 0) {
      return { message: "User registered successfully" };
    }

    return { message: "Registration failed" };
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async () => {
  try {
    const [users] = await db.execute("SELECT * FROM users");

    // Parse the privileges string for each user
    users.forEach((user) => {
      try {
        // Check if user.privileges is a valid JSON string
        JSON.parse(user.privileges);
        user.privileges = JSON.parse(user.privileges);
      } catch (error) {
        console.error(`Error parsing privileges for user ${user.id}:`, error);
      }
    });

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    return users[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (userId, updates) => {
  try {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    await db.execute(`UPDATE users SET ${fields} WHERE id = ?`, [
      ...values,
      userId,
    ]);
    return { message: "User updated successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);
    return { message: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  authenticate,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

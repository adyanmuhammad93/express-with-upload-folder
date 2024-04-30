import express, { Router } from "express";
import serverless from "serverless-http";
import mysql from "mysql2/promise";

const api = express();
const router = Router();

// Create a connection to the database
const db = mysql.createPool({
  host: "pdsi.dev.grid.co.id",
  user: "development_pdsi",
  password: "2GTa2eJSeC",
  database: "development_pdsi",
});

async function testConnection() {
  try {
    await db.getConnection();
    console.log("Successfully connected to the database!");
  } catch (error) {
    console.error("An error occurred while connecting to the database:", error);
  }
}

router.get("/hello", (req, res) => {
  testConnection();
  res.send("Hello World!");
});

api.use("/api/", router);

export const handler = serverless(api);

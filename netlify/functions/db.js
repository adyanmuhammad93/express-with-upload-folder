import mysql from "mysql2";

const pool = mysql.createPool({
  host: "pdsi.dev.grid.co.id",
  user: "development_pdsi",
  password: "2GTa2eJSeC",
  database: "development_pdsi",
});

export default pool.promise();

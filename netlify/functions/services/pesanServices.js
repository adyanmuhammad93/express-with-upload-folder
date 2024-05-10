import db from "../db.js";

const getPesans = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM pesan");
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getPesanById = async (id) => {
  try {
    const [rows] = await db.execute("SELECT * FROM pesan WHERE id = ?", [id]);
    if (rows.length > 0) {
      return rows[0]; // Return the first (and should be the only) row
    } else {
      return null; // No Pesan with the given id was found
    }
  } catch (error) {
    console.log(error);
  }
};

const createPesan = async (pesan) => {
  const fields = ["name", "email", "message"];
  const values = fields.map((field) =>
    pesan[field] !== undefined ? pesan[field] : null
  );
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO pesan (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.execute(sql, values);
  if (result) {
    const [rows] = await db.execute("SELECT * FROM pesan WHERE id = ?", [
      result.insertId,
    ]);
    return {
      message: "Data saved successfully!",
      id: result.insertId,
      data: rows[0], // The newly inserted data
    };
  } else {
    throw new Error("Failed to save data!");
  }
};

const updatePesan = async (id, updatedFields) => {
  try {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const fieldPlaceholders = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `UPDATE pesan SET ${fieldPlaceholders} WHERE id = ?`;
    values.push(id); // Add the id to the end of the values array

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      const [updatedRows] = await db.execute(
        "SELECT * FROM pesan WHERE id = ?",
        [id]
      );
      return {
        message: "Data updated successfully!",
        data: updatedRows[0], // The updated data
      };
    } else {
      throw new Error("Failed to update data!");
    }
  } catch (error) {
    console.log(error);
  }
};

const deletePesan = async (id) => {
  try {
    const sql = `DELETE FROM pesan WHERE id = ?`;
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows > 0) {
      return {
        message: "Data deleted successfully!",
      };
    } else {
      throw new Error("Failed to delete data or data not found!");
    }
  } catch (error) {
    console.log(error);
  }
};

export { getPesans, getPesanById, createPesan, updatePesan, deletePesan };

import db from "../db.js";

const getBeritas = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM berita");
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getBeritaById = async (id) => {
  try {
    const [rows] = await db.execute("SELECT * FROM berita WHERE id = ?", [id]);
    if (rows.length > 0) {
      return rows[0]; // Return the first (and should be the only) row
    } else {
      return null; // No Berita with the given id was found
    }
  } catch (error) {
    console.log(error);
  }
};

const createBerita = async (berita) => {
  const fields = [
    "title_ind",
    "title_eng",
    "meta_ind",
    "meta_eng",
    "content_ind",
    "content_eng",
    "date",
    "tags_ind",
    "tags_eng",
    "status",
    "image",
  ];
  const values = fields.map((field) =>
    berita[field] !== undefined ? berita[field] : null
  );
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO berita (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.execute(sql, values);
  if (result) {
    const [rows] = await db.execute("SELECT * FROM berita WHERE id = ?", [
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

const updateBerita = async (id, updatedFields) => {
  try {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const fieldPlaceholders = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `UPDATE berita SET ${fieldPlaceholders} WHERE id = ?`;
    values.push(id); // Add the id to the end of the values array

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      const [updatedRows] = await db.execute(
        "SELECT * FROM berita WHERE id = ?",
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

const deleteBerita = async (id) => {
  try {
    const sql = `DELETE FROM berita WHERE id = ?`;
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

export { getBeritas, getBeritaById, createBerita, updateBerita, deleteBerita };

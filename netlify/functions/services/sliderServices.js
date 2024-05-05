import db from "../db.js";

const getSliders = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM slider");
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getSliderById = async (id) => {
  try {
    const [rows] = await db.execute("SELECT * FROM slider WHERE id = ?", [id]);
    if (rows.length > 0) {
      return rows[0]; // Return the first (and should be the only) row
    } else {
      return null; // No Slider with the given id was found
    }
  } catch (error) {
    console.log(error);
  }
};

const createSlider = async (slider) => {
  const fields = [
    "created_at",
    "desc_ind",
    "desc_eng",
    "image",
    "status",
    "title_ind",
    "title_eng",
    "link_ind",
    "link_eng",
  ];
  const values = fields.map((field) =>
    slider[field] !== undefined ? slider[field] : null
  );
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO slider (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.execute(sql, values);
  if (result) {
    const [rows] = await db.execute("SELECT * FROM slider WHERE id = ?", [
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

const updateSlider = async (id, updatedFields) => {
  try {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const fieldPlaceholders = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `UPDATE slider SET ${fieldPlaceholders} WHERE id = ?`;
    values.push(id); // Add the id to the end of the values array

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      const [updatedRows] = await db.execute(
        "SELECT * FROM slider WHERE id = ?",
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

const deleteSlider = async (id) => {
  try {
    const sql = `DELETE FROM slider WHERE id = ?`;
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

export { getSliders, getSliderById, createSlider, updateSlider, deleteSlider };

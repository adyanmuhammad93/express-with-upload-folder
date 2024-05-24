import db from "../db.js";

const getPolicys = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM policy");
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const updatePolicy = async (updatedFields) => {
  try {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const fieldPlaceholders = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `UPDATE policy SET ${fieldPlaceholders} WHERE id = 1`;

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      const [updatedRows] = await db.execute(
        "SELECT * FROM policy WHERE id = 1"
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

export { getPolicys, updatePolicy };

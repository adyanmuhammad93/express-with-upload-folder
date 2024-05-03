import db from "../db.js";

const getSliders = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM slider");
    return rows;
  } catch (error) {
    console.log(error);
  }
};

export { getSliders };

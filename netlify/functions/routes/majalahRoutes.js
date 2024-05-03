import { Router } from "express";
import {
  getMajalahs,
  getMajalahById,
  createMajalah,
  updateMajalah,
  deleteMajalah,
} from "../services/majalahServices.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const majalahRoutes = Router();

majalahRoutes.get("/majalah", async (req, res) => {
  let data = await getMajalahs();

  data = data.map((majalah) => {
    let base64Image, base64Document;

    if (majalah.file_cover) {
      base64Image = Buffer.from(majalah.file_cover).toString("base64");
    }

    if (majalah.file) {
      base64Document = Buffer.from(majalah.file).toString("base64");
    }

    return {
      ...majalah,
      file_cover: base64Image,
      file: base64Document,
    };
  });

  res.json(data);
});

majalahRoutes.get("/majalah/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let majalah = await getMajalahById(id);

  if (majalah) {
    let base64Image, base64Document;

    if (majalah.file_cover) {
      base64Image = Buffer.from(majalah.file_cover).toString("base64");
    }

    if (majalah.file) {
      base64Document = Buffer.from(majalah.file).toString("base64");
    }

    majalah = {
      ...majalah,
      file_cover: base64Image,
      file: base64Document,
    };

    res.json(majalah);
  } else {
    res.status(404).json({ message: "Majalah not found" });
  }
});

majalahRoutes.post(
  "/majalah",
  upload.fields([
    { name: "file_cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    const fileCover = req.files["file_cover"][0];
    const file = req.files["file"][0];

    const formData = {
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      created_at: req.body.created_at,
      file_cover: fileCover.buffer,
      file: file.buffer,
      status: req.body.status,
    };

    const data = await createMajalah(formData);
    res.json(data);
  }
);

majalahRoutes.put(
  "/majalah/:id",
  upload.fields([
    { name: "file_cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    const id = req.params.id; // Get the id from the route parameters
    const fileCover = req.files?.["file_cover"]?.[0];
    const file = req.files?.["file"]?.[0];

    const updatedFields = {
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      created_at: req.body.created_at,
      status: req.body.status,
    };

    if (fileCover) {
      updatedFields.file_cover = fileCover.buffer;
    }

    if (file) {
      updatedFields.file = file.buffer;
    }

    const data = await updateMajalah(id, updatedFields);
    res.json(data);
  }
);

majalahRoutes.delete("/majalah/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deleteMajalah(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Majalah or Majalah not found",
    });
  }
});

export default majalahRoutes;

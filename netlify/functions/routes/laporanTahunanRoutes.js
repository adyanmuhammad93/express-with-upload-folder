import { Router } from "express";
import {
  getLaporanTahunans,
  getLaporanTahunanById,
  createLaporanTahunan,
  updateLaporanTahunan,
  deleteLaporanTahunan,
} from "../services/laporanTahunanServices.js";
import multer from "multer";
import cors from "cors";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const laporanTahunanRoutes = Router();

laporanTahunanRoutes.get("/laporan-tahunan", async (req, res) => {
  let data = await getLaporanTahunans();

  data = data.map((laporanTahunan) => {
    let base64Image, base64Document;

    if (laporanTahunan.file_cover) {
      base64Image = Buffer.from(laporanTahunan.file_cover).toString("base64");
    }

    if (laporanTahunan.file) {
      base64Document = Buffer.from(laporanTahunan.file).toString("base64");
    }

    return {
      ...laporanTahunan,
      file_cover: base64Image,
      file: base64Document,
    };
  });

  res.json(data);
});

laporanTahunanRoutes.get("/laporan-tahunan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let laporanTahunan = await getLaporanTahunanById(id);

  if (laporanTahunan) {
    let base64Image, base64Document;

    if (laporanTahunan.file_cover) {
      base64Image = Buffer.from(laporanTahunan.file_cover).toString("base64");
    }

    if (laporanTahunan.file) {
      base64Document = Buffer.from(laporanTahunan.file).toString("base64");
    }

    laporanTahunan = {
      ...laporanTahunan,
      file_cover: base64Image,
      file: base64Document,
    };

    res.json(laporanTahunan);
  } else {
    res.status(404).json({ message: "LaporanTahunan not found" });
  }
});

laporanTahunanRoutes.post(
  "/laporan-tahunan",
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

    const data = await createLaporanTahunan(formData);
    res.json(data);
  }
);

laporanTahunanRoutes.put(
  "/laporan-tahunan/:id",
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

    const data = await updateLaporanTahunan(id, updatedFields);
    res.json(data);
  }
);

laporanTahunanRoutes.delete("/laporan-tahunan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deleteLaporanTahunan(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete LaporanTahunan or LaporanTahunan not found",
    });
  }
});

laporanTahunanRoutes.use(cors());

export default laporanTahunanRoutes;

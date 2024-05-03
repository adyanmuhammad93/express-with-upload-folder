import { Router } from "express";
import {
  getPenghargaans,
  getPenghargaanById,
  createPenghargaan,
  updatePenghargaan,
  deletePenghargaan,
} from "../services/penghargaanServices.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const penghargaanRoutes = Router();

penghargaanRoutes.get("/penghargaan", async (req, res) => {
  let data = await getPenghargaans();

  data = data.map((penghargaan) => {
    let base64Image, base64Document;

    if (penghargaan.file_cover) {
      base64Image = Buffer.from(penghargaan.file_cover).toString("base64");
    }

    if (penghargaan.file) {
      base64Document = Buffer.from(penghargaan.file).toString("base64");
    }

    return {
      ...penghargaan,
      file_cover: base64Image,
      file: base64Document,
    };
  });

  res.json(data);
});

penghargaanRoutes.get("/penghargaan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let penghargaan = await getPenghargaanById(id);

  if (penghargaan) {
    let base64Image, base64Document;

    if (penghargaan.file_cover) {
      base64Image = Buffer.from(penghargaan.file_cover).toString("base64");
    }

    if (penghargaan.file) {
      base64Document = Buffer.from(penghargaan.file).toString("base64");
    }

    penghargaan = {
      ...penghargaan,
      file_cover: base64Image,
      file: base64Document,
    };

    res.json(penghargaan);
  } else {
    res.status(404).json({ message: "Penghargaan not found" });
  }
});

penghargaanRoutes.post(
  "/penghargaan",
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

    const data = await createPenghargaan(formData);
    res.json(data);
  }
);

penghargaanRoutes.put(
  "/penghargaan/:id",
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

    const data = await updatePenghargaan(id, updatedFields);
    res.json(data);
  }
);

penghargaanRoutes.delete("/penghargaan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deletePenghargaan(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Penghargaan or Penghargaan not found",
    });
  }
});

export default penghargaanRoutes;

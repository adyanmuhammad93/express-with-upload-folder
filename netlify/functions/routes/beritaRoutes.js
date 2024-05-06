import { Router } from "express";
import {
  getBeritas,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../services/beritaServices.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const beritaRoutes = Router();

beritaRoutes.get("/berita", async (req, res) => {
  let data = await getBeritas();

  data = data.map((berita) => {
    let base64Image;

    if (berita.image) {
      base64Image = Buffer.from(berita.image).toString("base64");
    }

    return {
      ...berita,
      image: base64Image,
    };
  });

  res.json(data);
});

beritaRoutes.get("/berita/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let berita = await getBeritaById(id);

  if (berita) {
    let base64Image;

    if (berita.image) {
      base64Image = Buffer.from(berita.image).toString("base64");
    }

    berita = {
      ...berita,
      image: base64Image,
    };

    res.json(berita);
  } else {
    res.status(404).json({ message: "Berita not found" });
  }
});

beritaRoutes.post(
  "/berita",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const image = req.files["image"][0];

    const formData = {
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      meta_ind: req.body.meta_ind,
      meta_eng: req.body.meta_eng,
      content_ind: req.body.content_ind,
      content_eng: req.body.content_eng,
      date: req.body.date,
      image: image.buffer,
      tags_ind: req.body.tags_ind,
      tags_eng: req.body.tags_eng,
      status: req.body.status,
    };

    const data = await createBerita(formData);
    res.json(data);
  }
);

beritaRoutes.put(
  "/berita/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const id = req.params.id; // Get the id from the route parameters
    const image = req.files?.["image"]?.[0];

    const updatedFields = {
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      meta_ind: req.body.meta_ind,
      meta_eng: req.body.meta_eng,
      content_ind: req.body.content_ind,
      content_eng: req.body.content_eng,
      date: req.body.date,
      image: image.buffer,
      tags_ind: req.body.tags_ind,
      tags_eng: req.body.tags_eng,
      status: req.body.status,
    };

    if (image) {
      updatedFields.image = image.buffer;
    }

    const data = await updateBerita(id, updatedFields);
    res.json(data);
  }
);

beritaRoutes.delete("/berita/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deleteBerita(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Berita or Berita not found",
    });
  }
});

export default beritaRoutes;

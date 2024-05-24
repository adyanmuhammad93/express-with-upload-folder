import { Router } from "express";
import {
  createScm,
  deleteScm,
  getScmById,
  getScms,
  updateScm,
} from "../services/scmRoutes.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const scmRoutes = Router();

scmRoutes.get("/scm", async (req, res) => {
  let data = await getScms();

  data = data.map((scm) => {
    let base64Image;

    if (scm.image) {
      base64Image = Buffer.from(scm.image).toString("base64");
    }

    return {
      ...scm,
      image: base64Image,
    };
  });

  res.json(data);
});

scmRoutes.get("/scm/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let scm = await getScmById(id);

  if (scm) {
    let base64Image;

    if (scm.image) {
      base64Image = Buffer.from(scm.image).toString("base64");
    }

    scm = {
      ...scm,
      image: base64Image,
    };

    res.json(scm);
  } else {
    res.status(404).json({ message: "Berita not found" });
  }
});

scmRoutes.post(
  "/scm",
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

    const data = await createScm(formData);
    res.json(data);
  }
);

scmRoutes.put(
  "/scm/:id",
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
      tags_ind: req.body.tags_ind,
      tags_eng: req.body.tags_eng,
      status: req.body.status,
    };

    if (image) {
      updatedFields.image = image.buffer;
    }

    const data = await updateScm(id, updatedFields);
    res.json(data);
  }
);

scmRoutes.delete("/scm/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deleteScm(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Berita or Berita not found",
    });
  }
});

export default scmRoutes;

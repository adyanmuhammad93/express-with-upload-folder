import { Router } from "express";
import {
  getBeritas,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../services/beritaServices.js";
import multer from "multer";
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage });

const beritaRoutes = Router();

beritaRoutes.get("/berita", async (req, res) => {
  let data = await getBeritas();
  res.json(data);
});

beritaRoutes.get("/berita/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let berita = await getBeritaById(id);

  if (berita) {
    res.json(berita);
  } else {
    res.status(404).json({ message: "Berita not found" });
  }
});

beritaRoutes.post("/berita", upload.single("image"), async (req, res) => {
  const image = req.file;

  const formData = {
    title_ind: req.body.title_ind,
    title_eng: req.body.title_eng,
    meta_ind: req.body.meta_ind,
    meta_eng: req.body.meta_eng,
    content_ind: req.body.content_ind,
    content_eng: req.body.content_eng,
    date: req.body.date,
    image: image ? image.path : null,
    tags_ind: req.body.tags_ind,
    tags_eng: req.body.tags_eng,
    status: req.body.status,
  };

  const data = await createBerita(formData);
  res.json(data);
});

beritaRoutes.put("/berita/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const image = req.file;

  const updatedFields = {
    title_ind: req.body.title_ind,
    title_eng: req.body.title_eng,
    meta_ind: req.body.meta_ind,
    meta_eng: req.body.meta_eng,
    content_ind: req.body.content_ind,
    content_eng: req.body.content_eng,
    date: req.body.date,
    image: image ? image.path : null,
    tags_ind: req.body.tags_ind,
    tags_eng: req.body.tags_eng,
    status: req.body.status,
  };

  if (image) {
    updatedFields.image = image.path;
  }

  const data = await updateBerita(id, updatedFields);
  res.json(data);
});

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

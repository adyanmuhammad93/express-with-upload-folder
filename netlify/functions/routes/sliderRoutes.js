import { Router } from "express";
import {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../services/sliderServices.js";
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

const sliderRoutes = Router();

sliderRoutes.get("/slider", async (req, res) => {
  let data = await getSliders();
  res.json(data);
});

sliderRoutes.get("/slider/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let slider = await getSliderById(id);

  if (slider) {
    res.json(slider);
  } else {
    res.status(404).json({ message: "Berita not found" });
  }
});

sliderRoutes.post("/slider", upload.single("image"), async (req, res) => {
  const image = req.file;

  const formData = {
    created_at: req.body.created_at,
    desc_ind: req.body.desc_ind,
    desc_eng: req.body.desc_eng,
    image: image ? image.path : null,
    status: req.body.status,
    title_ind: req.body.title_ind,
    title_eng: req.body.title_eng,
    link_ind: req.body.link_ind,
    link_eng: req.body.link_eng,
  };

  const data = await createSlider(formData);
  res.json(data);
});

sliderRoutes.put("/slider/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const image = req.file;

  const updatedFields = {
    created_at: req.body.created_at,
    desc_ind: req.body.desc_ind,
    desc_eng: req.body.desc_eng,
    image: image ? image.path : null,
    status: req.body.status,
    title_ind: req.body.title_ind,
    title_eng: req.body.title_eng,
    link_ind: req.body.link_ind,
    link_eng: req.body.link_eng,
  };

  const data = await updateSlider(id, updatedFields);
  res.json(data);
});

sliderRoutes.delete("/slider/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deleteSlider(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Slider or Slider not found",
    });
  }
});

export default sliderRoutes;

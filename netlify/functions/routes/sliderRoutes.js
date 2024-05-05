import { Router } from "express";
import {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../services/sliderServices.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const sliderRoutes = Router();

sliderRoutes.get("/slider", async (req, res) => {
  let data = await getSliders();

  data = data.map((slider) => {
    let base64Image;

    if (slider.image) {
      base64Image = Buffer.from(slider.image).toString("base64");
    }

    return {
      ...slider,
      image: base64Image,
    };
  });

  res.json(data);
});

sliderRoutes.get("/slider/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let slider = await getSliderById(id);

  if (slider) {
    let base64Image;

    if (slider.image) {
      base64Image = Buffer.from(slider.image).toString("base64");
    }

    slider = {
      ...slider,
      image: base64Image,
    };

    res.json(slider);
  } else {
    res.status(404).json({ message: "Slider not found" });
  }
});

sliderRoutes.post(
  "/slider",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const image = req.files["image"][0];

    const formData = {
      created_at: req.body.created_at,
      desc_ind: req.body.desc_ind,
      desc_eng: req.body.desc_eng,
      image: image.buffer,
      status: req.body.status,
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      link_ind: req.body.link_ind,
      link_eng: req.body.link_eng,
    };

    const data = await createSlider(formData);
    res.json(data);
  }
);

sliderRoutes.put(
  "/slider/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const id = req.params.id; // Get the id from the route parameters
    const image = req.files?.["image"]?.[0];

    const updatedFields = {
      created_at: req.body.created_at,
      desc_ind: req.body.desc_ind,
      desc_eng: req.body.desc_eng,
      status: req.body.status,
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      link_ind: req.body.link_ind,
      link_eng: req.body.link_eng,
    };

    if (image) {
      updatedFields.image = image.buffer;
    }

    const data = await updateSlider(id, updatedFields);
    res.json(data);
  }
);

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

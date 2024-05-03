import { Router } from "express";
import { getSliders } from "../services/sliderServices.js";
import multer from "multer";
import db from "../db.js";

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const sliderRoutes = Router();

sliderRoutes.get("/slider", async (req, res) => {
  let data = await getSliders();

  // Convert image buffers to Base64 strings
  data = data.map((slider) => {
    const base64Image = Buffer.from(slider.image).toString("base64");
    return { ...slider, image: base64Image };
  });

  res.json(data);
});

sliderRoutes.post(
  "/slider",
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    const image = req.files["image"][0];

    const formData = {
      title_ind: req.body.title_ind,
      title_eng: req.body.title_eng,
      desc_ind: req.body.desc_ind,
      desc_eng: req.body.desc_eng,
      image: image.buffer,
      link_ind: req.body.link_ind,
      link_eng: req.body.link_eng,
      status: req.body.status,
    };

    let sql = "INSERT INTO slider SET ?";

    db.query(sql, formData, (err, res) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occured!");
      }
      res.send("Data saved!");
    });
  }
);

export default sliderRoutes;

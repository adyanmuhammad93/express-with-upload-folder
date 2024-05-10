import { Router } from "express";
import {
  getPesans,
  getPesanById,
  createPesan,
  updatePesan,
  deletePesan,
} from "../services/pesanServices.js";

const pesanRoutes = Router();

pesanRoutes.get("/pesan", async (req, res) => {
  let data = await getPesans();
  res.json(data);
});

pesanRoutes.get("/pesan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  let pesan = await getPesanById(id);

  if (pesan) {
    res.json(pesan);
  } else {
    res.status(404).json({ message: "Pesan not found" });
  }
});

pesanRoutes.post("/pesan", async (req, res) => {
  const formData = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };

  const data = await createPesan(formData);
  res.json(data);
});

pesanRoutes.put("/pesan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters

  const updatedFields = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };

  const data = await updatePesan(id, updatedFields);
  res.json(data);
});

pesanRoutes.delete("/pesan/:id", async (req, res) => {
  const id = req.params.id; // Get the id from the route parameters
  const data = await deletePesan(id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Failed to delete Pesan or Pesan not found",
    });
  }
});

export default pesanRoutes;

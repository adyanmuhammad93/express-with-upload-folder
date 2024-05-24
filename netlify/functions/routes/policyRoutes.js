import { Router } from "express";
import { getPolicys, updatePolicy } from "../services/policyServices.js";

const policyRoutes = Router();

policyRoutes.get("/policy", async (req, res) => {
  let data = await getPolicys();
  res.json(data);
});

policyRoutes.put("/policy", async (req, res) => {
  const updatedFields = {
    title_ind: req.body.title_ind,
    title_eng: req.body.title_eng,
    content_ind: req.body.content_ind,
    content_eng: req.body.content_eng,
  };

  const data = await updatePolicy(updatedFields);
  res.json(data);
});

export default policyRoutes;

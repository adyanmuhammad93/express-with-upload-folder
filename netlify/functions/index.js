import express, { Router } from "express";
import cors from "cors"; // Local Dev
import serverless from "serverless-http";
import sliderRoutes from "./routes/sliderRoutes.js";
import laporanTahunanRoutes from "./routes/laporanTahunanRoutes.js";

const app = express();

// This will let us get the data sent via POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // Local Dev

// Use Routes
app.use("/api/v1", sliderRoutes);
app.use("/api/v1", laporanTahunanRoutes);

export const handler = serverless(app);

// app.use((err, res) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// }); // Local Dev

// app.listen(3030, () => {
//   console.log("Server is running on port 3030");
// }); // Local Dev

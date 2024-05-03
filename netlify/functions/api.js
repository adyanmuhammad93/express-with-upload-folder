import express, { Router } from "express";
import cors from "cors";
import serverless from "serverless-http";
import sliderRoutes from "./routes/sliderRoutes.js";
import laporanTahunanRoutes from "./routes/laporanTahunanRoutes.js";
import majalahRoutes from "./routes/majalahRoutes.js";
import penghargaanRoutes from "./routes/penghargaanRoutes.js";

const app = express();

// This will let us get the data sent via POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use Routes
app.use("/api/v1", sliderRoutes);
app.use("/api/v1", laporanTahunanRoutes);
app.use("/api/v1", majalahRoutes);
app.use("/api/v1", penghargaanRoutes);

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

export const handler = serverless(app);

// app.use((err, res) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// }); // Local Dev

// app.listen(3030, () => {
//   console.log("Server is running on port 3030");
// }); // Local Dev

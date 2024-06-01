import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import laporanTahunanRoutes from "./routes/laporanTahunanRoutes.js";
import majalahRoutes from "./routes/majalahRoutes.js";
import penghargaanRoutes from "./routes/penghargaanRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import beritaRoutes from "./routes/beritaRoutes.js";
import pesanRoutes from "./routes/pesanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scmRoutes from "./routes/scmRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";

const app = express();

// This will let us get the data sent via POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// Use Routes
app.use("/api/v1", laporanTahunanRoutes);
app.use("/api/v1", majalahRoutes);
app.use("/api/v1", penghargaanRoutes);
app.use("/api/v1", sliderRoutes);
app.use("/api/v1", beritaRoutes);
app.use("/api/v1", pesanRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", scmRoutes);
app.use("/api/v1", policyRoutes);

// Serve static files
app.use("/api/v1/uploads", express.static("uploads"));

// export const handler = serverless(app);

// app.use((err, res) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// }); // Local Dev

// app.listen(3030, () => {
//   console.log("Server is running on port 3030");
// }); // Local Dev

// Change this line to listen on the desired port (e.g., 80 for HTTP or 443 for HTTPS)
app.listen(3000, () => {
  console.log("Server is running on port 80");
});

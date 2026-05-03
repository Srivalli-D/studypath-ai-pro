import express from "express";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// API test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Serve frontend
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
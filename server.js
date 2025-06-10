const express = require("express");
const mongoose = require("mongoose");
const Project = require("./models/Project");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express(); // ✅ primero definís app
app.use(cors({ origin: "https://www.joaquinarretche.com" })); // ✅ luego usás cors

const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("🟢 Conectado a MongoDB Atlas"))
.catch(err => console.error("🔴 Error conectando a MongoDB:", err));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Proyecto no encontrado" });
  }
});

app.get("/api/info", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const info = await db.collection("info").findOne({ type: "personalContent" });
    res.json(info);
  } catch (err) {
    console.error("🔴 Error al obtener info:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/info-panel", async (req, res) => {
  try {
    const info = await mongoose.connection.db
      .collection("info")
      .findOne({ type: "infoPanel" });
    res.json(info);
  } catch (err) {
    console.error("Error al obtener info panel:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para mantener activo el backend (usado por frontend y UptimeRobot)
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
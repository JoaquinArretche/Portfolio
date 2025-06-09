const mongoose = require("mongoose");
const Project = require("./models/Project");

const mongoURI = "mongodb+srv://joaquin:Arg2030@portfolio.yzvtwug.mongodb.net/portfolio?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("🟢 Conectado a MongoDB Atlas");
  seedProjects();
}).catch(err => {
  console.error("🔴 Error conectando a MongoDB:", err);
});

const sampleProjects = [
  {
    title: "Sitio Personal",
    description: "Portfolio minimalista con HTML, CSS y JS.",
    year: 2024,
    coverImageUrl: "https://via.placeholder.com/400x250?text=Sitio+1",
    images: [
      "https://via.placeholder.com/300x200?text=Vista+1",
      "https://via.placeholder.com/300x200?text=Vista+2",
      "https://via.placeholder.com/300x200?text=Vista+3"
    ]
  },
  {
    title: "Tienda Online",
    description: "E-commerce construido con React y backend.",
    year: 2023,
    coverImageUrl: "https://via.placeholder.com/400x250?text=Tienda",
    images: [
      "https://via.placeholder.com/300x200?text=Producto+1",
      "https://via.placeholder.com/300x200?text=Producto+2"
    ]
  },
  {
    title: "App de Tareas",
    description: "Gestión de tareas con MongoDB y Express.",
    year: 2025,
    coverImageUrl: "https://via.placeholder.com/400x250?text=App+Tareas",
    images: [
      "https://via.placeholder.com/300x200?text=Pantalla+1",
      "https://via.placeholder.com/300x200?text=Pantalla+2"
    ]
  }
];

async function seedProjects() {
  try {
    await Project.deleteMany({});
    await Project.insertMany(sampleProjects);
    console.log("✅ Proyectos insertados con éxito");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error al insertar proyectos:", err);
  }
}
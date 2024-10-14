require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    process.exit(1); // Sale de la aplicación en caso de error
  }
  console.log("Conectado a la base de datos MySQL");
});

// Rutas
app.use("/api/users", userRoutes);
// Rutas Reservar
app.use("/api/reserva", reservaRoutes);

// Middleware para manejo de errores
app.use(errorHandler);

//Middleware para mostrar imagenes
app.use(express.static(path.join(__dirname, "./imagesUser/dbImages")));
app.use(express.static(path.join(__dirname, "./imagesUser/imagesPerfil")));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

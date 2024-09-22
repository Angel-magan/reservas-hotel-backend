// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Configuración de la conexión a la base de datos
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "4ng3lM4g4n",
//   database: "reservasHotel",
// });

// // Verifica la conexión a la base de datos
// db.connect((err) => {
//   if (err) {
//     console.error("Error conectando a la base de datos:", err);
//     return;
//   }
//   console.log("Conectado a la base de datos MySQL");
// });

// // Ruta para obtener datos
// app.get("/api/datos", (req, res) => {
//   const sql = "SELECT * FROM usuario";
//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // Ruta para registrar usuarios con post
// app.post("/api/register", (req, res) => {
//   const { username, email, password, phoneNumber } = req.body;

//   if (!username || !email || !password || !phoneNumber) {
//     return res.status(400).json({ message: "Faltan datos" });
//   }

//   const sql =
//     "INSERT INTO usuario (nombre, email, contrasenia, telefono) VALUES (?, ?, ?, ?)";

//   db.query(sql, [username, email, password, phoneNumber], (err, result) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error al registrar usuario", error: err });
//     }
//     res.status(201).json({ message: "Usuario registrado correctamente" });
//   });
// });

// //Ruta para login
// app.post("/api/login", (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Faltan datos" });
//   }

//   const sql = "SELECT * FROM usuario WHERE nombre = ? AND contrasenia = ?";
//   db.query(sql, [username, password], (err, results) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error en la consulta", error: err });
//     }
//     if (results.length > 0) {
//       // El usuario existe y la contraseña es correcta
//       res.status(200).json({ message: "Inicio de sesión exitoso" });
//     } else {
//       res.status(401).json({ message: "Usuario o contraseña incorrectos" });
//     }
//   });
// });

// // Iniciar el servidor
// app.listen(5000, () => {
//   console.log("Servidor backend corriendo en el puerto 5000");
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorHandler");

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

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

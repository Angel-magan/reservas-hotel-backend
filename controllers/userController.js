const db = require("../config/db");

//Ver usuarios
exports.infoUser = (req, res) => {
  const sql = "SELECT * FROM usuario";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
};

// Registrar un usuario
exports.registerUser = (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const sql =
    "INSERT INTO usuario (nombre, email, contrasenia, telefono) VALUES (?, ?, ?, ?)";

  db.query(sql, [username, email, password, phoneNumber], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al registrar usuario", error: err });
    }
    res.status(201).json({ message: "Usuario registrado correctamente" });
  });
};

// Iniciar sesión
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const sql = "SELECT * FROM usuario WHERE nombre = ? AND contrasenia = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error en la consulta", error: err });
    }

    if (results.length > 0) {
      res.status(200).json({ message: "Inicio de sesión exitoso" });
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
  });
};

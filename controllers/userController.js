const db = require("../config/db");

//Para la de perfil
const multer = require("multer");
//##############################
//Para imagen
const path = require("path");
const fs = require("fs");

//Para la de perfil
// Configurar multer para guardar las imágenes del perfil
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../imagesUser/imagesPerfil"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const fileUpload = multer({
//   storage: diskstorage,
// }).single("foto_perfil");

//Para ambas fotos
const fileUpload = multer({
  storage: diskstorage,
}).fields([
  { name: "foto_perfil", maxCount: 1 },
  { name: "fondo_perfil", maxCount: 1 },
]);
//##############################

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
    return res.status(400).json({ message: "Faltan datos por ingresar" });
  }

  const sql =
    "INSERT INTO usuario (nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?)";

  db.query(sql, [username, email, password, phoneNumber], (err, result) => {
    if (err) {
      console.error("Error SQL:", err); // Añadir para depurar
      return res
        .status(500)
        .json({ message: "Error al registrar usuario", error: err });
    }
    res.status(201).json({ message: "Usuario registrado correctamente" });
  });
};

// Iniciar sesión
// exports.loginUser = (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Faltan datos" });
//   }

//   const sql = "SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?";
//   db.query(sql, [username, password], (err, results) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error en la consulta", error: err });
//     }

//     if (results.length > 0) {
//       res.status(200).json({ message: "Inicio de sesión exitoso" });
//     } else {
//       res.status(401).json({ message: "Usuario o contraseña incorrectos" });
//     }
//   });
// };

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const sql =
    "SELECT id_usuario, nombre, correo FROM usuario WHERE correo = ? AND contrasena = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error en la consulta", error: err });
    }

    if (results.length > 0) {
      const user = results[0]; // Devuelve el primer resultado de la consulta
      res.status(200).json({
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  });
};

//Tratando de agregar la imagen a mi código########################################
exports.getUserProfile = (req, res) => {
  const userId = req.params.id;

  const sql =
    "SELECT nombre, apellido, direccion, correo, telefono, biografia, foto_perfil, fondo_perfil FROM usuario WHERE id_usuario = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener el perfil", error: err });
    }

    if (results.length > 0) {
      const user = results[0];
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  });
};

exports.editUser = (req, res) => {
  fileUpload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error al subir la imagen" });
    }

    const {
      id_usuario,
      nombre,
      apellido,
      direccion,
      correo,
      telefono,
      biografia,
    } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ message: "Falta el ID del usuario" });
    }

    // const foto_perfil = req.file ? req.file.filename : null;
    // const fondo_perfil = req.file ? req.file.filename : null;

    //Probando para ambas imagenes
    const foto_perfil = req.files?.foto_perfil
      ? req.files.foto_perfil[0].filename
      : null;
    const fondo_perfil = req.files?.fondo_perfil
      ? req.files.fondo_perfil[0].filename
      : null;

    const sql = `
      UPDATE usuario
      SET nombre = COALESCE(?, nombre),
          apellido = COALESCE(?, apellido),
          direccion = COALESCE(?, direccion),
          correo = COALESCE(?, correo),
          telefono = COALESCE(?, telefono),
          biografia = COALESCE(?, biografia),
          foto_perfil = COALESCE(?, foto_perfil),
          fondo_perfil = COALESCE(?, fondo_perfil)
      WHERE id_usuario = ?
    `;

    db.query(
      sql,
      [
        nombre || null,
        apellido || null,
        direccion || null,
        correo || null,
        telefono || null,
        biografia || null,
        foto_perfil || null,
        fondo_perfil || null,
        id_usuario,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al actualizar el perfil", error: err });
        }

        res.status(200).json({ message: "Perfil actualizado correctamente" });
      }
    );
  });
}; //############################################

//Ver imagenes
exports.seeImage = (req, res) => {
  const sql = "SELECT * FROM imagen";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    // res.json(result);
    result.map((img) => {
      fs.writeFileSync(
        path.join(
          __dirname,
          "../imagesUser/dbImages/" + img.id_imagen + ".png"
        ),
        img.datos
      );
    });

    const imagedir = fs.readdirSync(
      path.join(__dirname, "../imagesUser/dbImages/")
    );

    res.json(imagedir);
  });
};

//Insertar imagenes
exports.editImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo");
  }

  const type = req.file.mimetype;
  const name = req.file.originalname;

  // Leer la imagen desde la ruta donde Multer la ha guardado temporalmente
  const data = fs.readFileSync(
    path.join(__dirname, "../imagesUser/images/" + req.file.filename)
  );

  // Consulta SQL para insertar la imagen en la base de datos
  const sql = "INSERT INTO imagen (tipo, nombre, datos) VALUES (?, ?, ?)";
  const values = [type, name, data];

  // Ejecutar la consulta SQL
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error del servidor al insertar la imagen");
    }

    res.send("Imagen subida y guardada en la base de datos correctamente");
  });
};

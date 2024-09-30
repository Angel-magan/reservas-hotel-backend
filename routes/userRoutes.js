const express = require("express");
const {
  infoUser,
  getUserProfile,
  registerUser, //ESTE ES PARA INSERTAR
  loginUser,
  editUser,
  editImage,
  seeImage,
} = require("../controllers/userController");

const fileUpload = require("../middleware/fileUpload");
const router = express.Router();

// Rutas de usuario
router.get("/datos", infoUser);
router.get("/profile/:id", getUserProfile);
router.post("/register", registerUser); //ESTE ES PARA INSERTAR
router.post("/login", loginUser);
router.post("/editUser", editUser);
//para imagen
router.post("/editImage", fileUpload, editImage);
router.get("/seeImage", seeImage);
module.exports = router;

const express = require("express");
const {
  registerUser,
  loginUser,
  infoUser,
  editUser,
} = require("../controllers/userController");

const router = express.Router();

// Rutas de usuario
router.get("/datos", infoUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const {
  registerUser,
  loginUser,
  infoUser,
  editUser,
} = require("../controllers/userController");

const { registerPayment } = require("../controllers/paymentController");

const router = express.Router();

// Rutas de usuario
router.get("/datos", infoUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

// Rutas de factura
router.post("/payment", registerPayment);

module.exports = router;

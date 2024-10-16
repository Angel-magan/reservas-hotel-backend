const express = require("express");
const { registerPayment } = require("../controllers/paymentController");

const router = express.Router();

// Rutas de usuario
router.post("/registerPayment", registerPayment);
module.exports = router;

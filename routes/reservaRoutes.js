const express = require("express");
const { insertarReserva } = require("../controllers/reservaController");

const router = express.Router();

// Define la ruta para la inserción de reservas
router.post("/hotel/:hotelId/room/:roomId", insertarReserva);

module.exports = router;

const { generarDatetime } = require("../helpers/dateHelper");
const db = require("../config/db");

// Registrar una factura
exports.registerPayment = (req, res) => {
  const {
    id_reserva,
    precio_reserva,
    precio_limpieza,
    precio_traveluxe,
    precio_total,
  } = req.body;

  const numero_factura = "TVLX-" + Date.now() + "-" + id_reserva;
  const fecha_factura = generarDatetime();

  if (
    !id_reserva ||
    !precio_reserva ||
    !precio_limpieza ||
    !precio_traveluxe ||
    !precio_total
  ) {
    return res.status(400).json({ message: "Faltan datos por ingresar" });
  }

  const sql =
    "INSERT INTO factura (numero_factura, id_reserva, fecha_factura, precio_reserva, precio_traveluxe, precio_limpieza, total) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      numero_factura,
      id_reserva,
      fecha_factura,
      precio_reserva,
      precio_traveluxe,
      precio_limpieza,
      precio_total,
    ],
    (err, result) => {
      if (err) {
        console.error("Error SQL:", err); // Añadir para depurar
        return res
          .status(500)
          .json({ message: "Error al registrar la factura", error: err });
      }
      res.status(201).json({ message: "Factura generada correctamente" });
    }
  );
};

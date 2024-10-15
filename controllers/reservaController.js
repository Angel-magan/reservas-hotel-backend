const db = require("../config/db");

exports.insertarReserva = (req, res) => {
    console.log("Solicitud recibida para insertar reserva:", req.body);
    const { 
        num_hotel, 
        num_habitacion, 
        cant_huespedes, 
        fecha_llegada, 
        fecha_salida,
        id_usuario
    } = req.body;

    if (!num_hotel || !num_habitacion || !cant_huespedes || !fecha_llegada || !fecha_salida || !id_usuario) {
      return res.status(400).json({ message: "Faltan datos para ingresar la reserva" });
    }
  
    const sql =
      "INSERT INTO reserva (num_hotel, num_habitacion, cant_huespedes, fecha_llegada, fecha_salida, id_usuario) VALUES (?, ?, ?, ?, ?, ?)";
  
    db.query(sql, [num_hotel, num_habitacion, cant_huespedes, fecha_llegada, fecha_salida, id_usuario], (err, result) => {
      if (err) {
        console.error("Error SQL:", err); 
        return res
          .status(500)
          .json({ message: "Error al agregar reserva", error: err });
      }
      res.status(201).json({ message: "Reserva guardada exitosamente" });
    });
};
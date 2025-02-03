const express = require('express');
const cors = require('cors');

const MercadoPago = require('mercadopago'); // Importa la SDK de MercadoPago

const app = express();
const port = 3000;

// Configura MercadoPago con tu access token


// Ruta para recibir las notificaciones de pago (webhook)
app.post("/webhook", async function (req, res) {
  const payment = req.body; // El pago se envía en el cuerpo de la solicitud
  console.log(payment);

  // Si el pago está aprobado, realiza alguna acción adicional
  if (payment.status === 'approved') {
    console.log('Pago aprobado');
    // Aquí puedes agregar lógica para actualizar tu base de datos u otras acciones
  }

  // Responde con un código de estado 200 para confirmar la recepción de la notificación
  res.status(200).send();
});

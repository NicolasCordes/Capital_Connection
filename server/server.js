import express from "express";
import cors from "cors";
import {MercadoPagoConfig, Preference} from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: 'TEST-6083462466960165-101910-ab0d02d54a828750e570c73c7ce1d464-581495007'});

const app = express();
const port = 3000; // Puedes cambiarlo si quieres

app.use(cors()); // Permitir peticiones de otros dominios
app.use(express.json()); // Permitir peticiones de otros dominios



app.get("/",(req,res)=>{
  res.send("Server !")
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


app.post("/create_preference", async (req, res) => {
try{
 const body = {
    items: [{
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "ARS",
    },
  ],
    back_urls: {
        success: "https://www.youtube.com/@onthecode",
        failure: "https://www.youtube.com/@onthecode",
        pending: "https://www.youtube.com/@onthecode",
    },
    auto_return: "approved",
    notification_url:"https://e3af-200-105-34-95.ngrok-free.app/webhook"
};

const preference = new Preference(client)
  const result = await preference.create({body});
  res.json({
    id: result.id,
  });
  } catch (error) {
      res.status(500).json({ error: "No se pudo crear la preferencia de pago." });
  }
});

// Ruta Webhook para recibir notificaciones de Mercado Pago
app.post('/webhook', async function (req, res) {
  console.log('los quiero')
});

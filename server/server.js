import express from "express";
import cors from "cors";
import {MercadoPagoConfig, Preference} from 'mercadopago'
import fetch from "node-fetch";
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
        success: "http://localhost:4200/success",
        failure: "http://localhost:4200/failure",
        pending: "http://localhost:4200/pending",
    },
    auto_return: "approved",
    notification_url:"https://e3af-200-105-34-95.ngrok-free.app/webhook",
    metadata: {
      iddon: req.body.iddon,
      idacc: req.body.idacc  // Aquí pones el ID que necesites, como el orderId
    },
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

  if (req.body?.data?.id) {
      const paymentId = req.body.data.id;
      try{
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,{
          method:'GET',
          headers:{
            'Authorization': `Bearer ${client.accessToken}`
          }
        });

        if(response.ok){
          const data = await response.json();
          if (data.status) {

            console.log(data.metadata.iddon);

            if (data.status === "approved") {
              console.log("✅ Pago aprobado");

              // Realizamos el PATCH a tu backend para actualizar el estado de la donación
              const updateResponse = await fetch(`http://localhost:8080/accounts/${data.metadata.idacc}/donations/${data.metadata.iddon}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: "approved" }) // Estado que queremos poner
              });

              if (updateResponse.ok) {
                console.log("Estado de la donación actualizado a 'approved'");
              } else {
                const errorDetails = await updateResponse.json();
                console.log("Error al actualizar el estado de la donación:", errorDetails);
              }

          } else if (data.status === "rejected") {
              console.log("❌ Pago rechazado");

              const updateResponse = await fetch(`http://localhost:8080/accounts/${data.metadata.idacc}/donations/${data.metadata.iddon}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: "rejected" })
              });

              if (updateResponse.ok) {
                console.log("Estado de la donación actualizado a 'rejected'");
              } else {
                const errorDetails = await updateResponse.json();
                console.log("Error al actualizar el estado de la donación:", errorDetails);
              }
              } else {
                console.log("⚠️ Estado desconocido:", data.status);
            }
        } else {
            console.log("No se encontró la propiedad 'status' en la respuesta.");
        }
        }else{
          console.log('error');
        }
        res.sendStatus(200);
      }catch(error){
        console.error('Error: ', error);
        res.sendStatus(500);
      }
  } else {

  }
});

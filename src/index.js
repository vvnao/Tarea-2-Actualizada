import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { HOST, PORT } from "./config/configEnv.js"; 

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
connectDB()
  .then(() => {
    routerApi(app);

    // Levanta el servidor Express
    app.listen(PORT, HOST, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
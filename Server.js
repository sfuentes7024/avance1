import express, { response } from "express";
import path from 'path';
import routerProducts from './src/routers/routerProducts.js';
import routerCart from './src/routers/routerCart.js';
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 8080;
const __dirname = fileURLToPath(import.meta.url);
const app = express();

app.use(express.json());
app.use("/api/productos", routerProducts);
app.use("/api/carrito", routerCart);
app.use((req,res)=>{
    const response = {
        error:-1,
        description:`${req.url} ${req.method} ruta no implementada`
    }
    res.status(404).json(response);
});

const listener = app.listen(PORT, () =>{
    console.log(`Server listening on port: ${listener.addres().port}`);
});

listener.on("Error", (error)=> console.error(error));

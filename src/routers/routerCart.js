import express from "express";
import { appendFile } from "fs";
import Container from "../../container.js";


const app = express();
app.use(express.urlencoded({ extended: true}));
const container = new Container("./db/cart.json");
const contenedor = new Container("./db/productos.json");

app.get("/:id/productos", async(req,res) =>{
    let response;
    try{
        const id = parseInt(req.params.id);
        response = await container.getById(id);
        if (response === null){
            throw new Error("ID no existe");
        }
    }catch(e){
        console.error(e);
        res.status(404);
    }
    res.json(response);
});

app.post("/", async(req,res)=>{
    let response;
    try{
        const{ nombre, descripcion, codigo, url, precio, stock} = req.body;
        const add = {};
        response = await container.save(add);
    }catch(e){
        console.error(e);
    }
    res.json(response);
});

app.post("/:id/productos", async(req,res)=> {
    try{
        const id = parseInt(req.params.id);
        const productsAdd = req.body;
        const cartAll = await container.getAll();
        const productsDB = await contenedor.getAll();
        const elementCart = cartAll.find((elem)=>elem.id === id);

        productsAdd.productos.forEach((idProd)=>{
            if(elementCart) {
                const prod = productsDB.find((elem) => elem.id === idProd);
                if(prod) elementCart.productos.push(prod);
            }
        });

        container.writeFile(JSON.stringify([...cartAll]));
        res.json({
            update: "ok",
            id: req.params.id,
            newProducts: productsAdd,
        });
    }catch(e){
        console.error(e);
    }
});

app.delete("/:id", async(req,res) => {
    try{
        const id = parseInt(re.params.id);
        const allElements = await container.getAll();
        const element = allElements.find((elem) => elem.id === id);
        const index = allElements.indexOf(element);
        if(index != -1){
            allElements.splice(index, 1);
            container.writeFile(JSON.stringify([...allElements]));
            res.json({
                Delete: "ok",
                id: req.params.id,
                ElementDelete: element,
            });
        }else{
            res.json({
                Delete: `Error, ID: ${id} no existe`,
                id: req.params.id,
                ElementDelete: null,
            });
        }
    }catch(e){
        console.error(e);
    }
});

app.delete("/:id/productos/:id_prod", async(req,res) =>{
    try{
        const id = parseInt(req.params.id);
        const idProd = parseInt(req.params.id_prod);
        const cartAll = await container.getAll();
        const elementCart = cartAll.productos.find((elem) => elem.id === id);
        const prod = elementCart.productos.find((elem) => elem.id === idProd);
        const index = elementCart.productos.indexOf(prod);
        if(index != -1){
            elementCart.productos.splice(index, 1);
            container.writeFile(JSON.stringify([...cartAll]));
            res.json({
                Delete: "ok",
                idCart: req.params.id,
                ElementDelete: prod,
            });
        }else{
            res.json({
                Delete: `Error, ID: ${id} no existe`,
                id: req.params.id,
                ElementDelete: null,
            });
        }
    }catch(e){
        console.error(e);
    }
});

export default app;
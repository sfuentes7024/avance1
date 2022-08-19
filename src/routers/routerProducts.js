import express from "express";
import Container from "../../container.js";
import { isAuthorized } from "../utils/isAdmin.js";

const routerProducts = express.Router();
routerProducts.use(express.urlencoded({extended: true}));
const contenedor = new Container("./db/productos.json");

routerProducts.get("/:id", async(req,res)=> {
    let response;
    try{
        const id = parseInt(req.params.id);
        if(id){
            response = await contenedor.getById(id);
            if (response === null) {
                throw new Error("ID no existe");
            } 
        }else{
            response = await contenedor.getAll();
        }
    }catch(e){
        console.error(e);
        res.status(404);
    }
    res.json(response);
});

routerProducts.post("/", isAuthorized, async(req, res)=> {
    let response;
    const dateTime = new Date();
    const fecha = dateTime.getDate()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getFullYear();
    const hora = dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();
    
    try{
        const{nombre, descripcion, codigo, url, precio, stock} = req.body;
        const add = {
            nombre,
            descripcion,
            codigo,
            url,
            precio,
            stock,
            timeStamp: fecha + " "+ hora,
        };
        response = await contenedor.save(add);
    }catch(e){
        console.error(e);
    }
    res.json(response);
});

routerProducts.put("/:id", isAuthorized, async(req,res) => {
    let element;
    try{
        const id = parseInt(req.params.id);
        const update = req.body;
        const allElements = await contenedor.getAll();
        element = allElements.find((elem) => elem.id === id);
        if (element) {
            if (update.nombre && element.nombre != update.nombre)
              element["nombre"] = update.nombre;
            if (update.descripcion && element.descripcion != update.descripcion)
              element["descripcion"] = update.descripcion;
            if (update.codigo && element.codigo != update.codigo)
              element["codigo"] = update.codigo;
            if (update.url && element.url != update.url)
              element["url"] = update.url;
            if (update.precio && element.precio != update.precio)
              element["precio"] = update.precio;
        if (update.stock && element.stock != update.stock)
              element["stock"] = update.stock;
        }

        contenedor.writeFile(JSON.stringify([...allElements]));
        res.json({
            update: "ok",
            id: req.params.id,
            newElement: element,
        });
    }catch(e){
        console.error(e);
    }
});

routerProducts.delete("/:id", isAuthorized, async(req,res) => {
    try{
        const id = parseInt(req.params.id);
        const allElements = await contenedor.getAll();
        const element = allElements.find((elem) => elem.id === id);
        const index = allElements.indexOf(element);
        if (index != -1) {
            allElements.splice(index, 1);
            contenedor.writeFile(JSON.stringify([...allElements]));
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

export default routerProducts;
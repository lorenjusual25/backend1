import express, { urlencoded } from 'express'
import productsRouter from './routers/products.routes.js'
import cartsRouter from './routers/carts.routes.js'
import viewsRouter from './routers/views.routes.js'
import handlebars from "express-handlebars"
import {__dirname} from "./util.js"
import { Server } from "socket.io"
//import ProductManager from './dao/productmanager.js'
import mongoose from 'mongoose'
import { productModel } from './model/productModel.js'
//const productManager = new ProductManager()
const app = express()
const PORT = 3000
//Handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")
//servir archivos estaticos
app.use(express.static(__dirname + "/public"))
//Middleware para parsear JSON en general
app.use(express.json())
//PRODUCTOS
app.use("/api/products", productsRouter)
//CARRITOS
app.use("/api/carts", cartsRouter)
//VIEWS
app.use("/", viewsRouter)
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto en ${PORT}`)
    mongoose.connect('mongodb://lsuareza2005_db_user:Z5BeduuVitnfHWt5@ac-q12kq7a-shard-00-00.zjlv4ty.mongodb.net:27017,ac-q12kq7a-shard-00-01.zjlv4ty.mongodb.net:27017,ac-q12kq7a-shard-00-02.zjlv4ty.mongodb.net:27017/?ssl=true&replicaSet=atlas-11l0md-shard-0&authSource=admin&appName=Cluster0')
    .then(() => console.log('Conectado a la DB'))
    .catch((error) => console.error(error))
})
const io = new Server(httpServer)
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado: " + socket.id)
    socket.on('createProduct', async (product) => {
        const count = await productModel.countDocuments()
        await productModel.create({code:count + 1, ...product })
        io.emit('products', await productModel.find().lean())
    })
    socket.on('deleteProduct', async (code) => {
        await productModel.findOneAndDelete({code})
        io.emit('products', await productModel.find().lean())
    })
})
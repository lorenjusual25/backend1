import express from 'express'
import productsRouter from './routers/products.routes.js'
import cartsRouter from './routers/carts.routes.js'
import viewsRouter from './routers/views.routes.js'
import handlebars from "express-handlebars"
import {__dirname} from "./util.js"
import { Server } from "socket.io"
//import ProductManager from './dao/productmanager.js'
import mongoose from 'mongoose'
import { productModel } from './model/productModel.js'
import "dotenv/config"
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
app.use("/realtimeproducts", viewsRouter)
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto en ${PORT}`)
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la DB'))
    .catch((error) => console.error(error))
})
const io = new Server(httpServer)
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado: " + socket.id)
    socket.on('createProduct', async (product) => {
        const count = await productModel.countDocuments()
        await productModel.create({code:count + 1, ...product })
        io.emit('products')
    })
    socket.on('deleteProduct', async (id) => {
        await productModel.findByIdAndDelete(id)
        io.emit('products')
    })
})
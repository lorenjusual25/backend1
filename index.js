import express from 'express'
import productsRouter from './routers/products.routes.js'
import cartsRouter from './routers/carts.routes.js'
import viewsRouter from './routers/views.routes.js'
import handlebars from "express-handlebars"
import {__dirname} from "./util.js"
import { Server } from "socket.io"
import ProductManager from './dao/productmanager.js' //necesario tener los productos desde el server
const productManager = new ProductManager()
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
})
const io = new Server(httpServer)
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado: " + socket.id)
    //enviar los productos al cliente que se conectó
    socket.emit('products', productManager.getProducts())
    //recibir evento de agregar un producto por parte del cliente
    socket.on('createProduct', (product) => {
        productManager.createProduct(product)
        io.emit('products', productManager.getProducts())
    })
    //o el evento de elminar
    socket.on('deleteProduct', (id) => {
        productManager.deleteProduct(id)
        io.emit('products', productManager.getProducts())
    })
})
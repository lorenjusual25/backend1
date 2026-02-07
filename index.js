import express from 'express'
import ProductManager from './actividad/actividad1.js'
import CartManager from './actividad/cartmanager.js'
import fs from 'fs'
const app = express()
const PORT = 3000
const products = new ProductManager()
const carts = new CartManager()
app.use(express.json())

app.get("/",(req,res) => {
    const productsData = JSON.parse(fs.readFileSync("./products.json","utf-8")) 
    res.json(productsData)
})

app.get("/api/products/:pid",(req,res) => {
    const productId = products.getProductByID(parseInt(req.params.pid))
    if(!productId)
        return res.status(404).json({error:"producto no encontrado en get"})
    res.json(productId)
})

app.post("/api/products",(req,res) => {
    const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const { title, description, price, thumbnail, stock, status, category } = req.body
    const newProduct = {
        id: productData.length + 1,
        title,
        description,
        price,
        thumbnail,
        stock,
        status,
        category
    }
    productData.push(newProduct)
    fs.writeFileSync("./products.json",JSON.stringify(productData, null, 2))
    res.status(201).json(newProduct)
})

app.put("/api/products/:pid",(req,res) => {
    const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const {pid} = req.params
    const { title, description, price, thumbnail, stock, status, category } = req.body
    const productIndex = productData.findIndex(p => p.id === parseInt(pid))
    if (productIndex === -1) 
        return res.status(404).json({error:"producto no encontrado en put"})
    const product = productData[productIndex]
    productData[productIndex] = {
        ...product,
        title: title ?? product.title,
        description: description ?? product.description,
        price: price ?? product.price,
        thumbnail: thumbnail ?? product.thumbnail,
        stock: stock ?? product.stock,
        status: status ?? product.status,
        category: category ?? product.category,
        id: product.id
    }
    fs.writeFileSync("./products.json",JSON.stringify(productData, null, 2))
    res.json(productData[productIndex])
})

app.delete("/api/products/:pid",(req,res) => {
    const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const {pid} = req.params
    const product = productData.find(p => p.id === parseInt(pid))
    if (!product) 
        return res.status(404).json({error:"producto no encontrado en delete"})
    const updatedData = productData.filter(p => p.id !== parseInt(pid))
    fs.writeFileSync("./products.json",JSON.stringify(updatedData, null, 2))
    res.json({message:"Producto eliminado"})
})


app.post("/api/carts",(req,res) => {
    const newCart = carts.createCart()
    res.status(201).json(newCart)
})
app.get("/api/carts/:cid",(req,res) => {
    const {cid} = req.params
    const cart = carts.getCartByID(parseInt(cid))
    if (!cart) 
        return res.status(404).json({error:"carrito no encontrado en get"})
    res.json(cart)
})
app.post("/api/carts/:cid/product/:pid",(req,res) => {
    const {cid, pid} = req.params
    const cart = carts.addProductToCart(parseInt(cid), parseInt(pid))
    if (!cart) 
        return res.status(404).json({error:"carrito o producto no encontrado en addProductToCart"})
    res.json(cart)
})
app.listen(PORT, () => {
    console.log(`Escuchando puerto en ${PORT}`)
})
import { Router } from "express";
import ProductManager from "../dao/productmanager.js";
import fs from "fs"
const router = Router()
const products = new ProductManager()
router.get("/",(req,res) => {
    const productsData = products.getProducts()
    res.json(productsData)
})

router.get("/:pid",(req,res) => {
    const productId = products.getProductByID(parseInt(req.params.pid))
    if(!productId)
        return res.status(404).json({error:"producto no encontrado en get"})
    res.json(productId)
})

router.post("/",(req,res) => {
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

router.put("/:pid",(req,res) => {
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

router.delete("/:pid",(req,res) => {
    const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const {pid} = req.params
    const product = productData.find(p => p.id === parseInt(pid))
    if (!product) 
        return res.status(404).json({error:"producto no encontrado en delete"})
    const updatedData = productData.filter(p => p.id !== parseInt(pid))
    fs.writeFileSync("./products.json",JSON.stringify(updatedData, null, 2))
    res.json({message:"Producto eliminado"})
})
export default router
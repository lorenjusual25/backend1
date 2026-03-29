import { Router } from "express";
import { cartModel } from "../model/cartModel.js";
//import CartManager from "../dao/cartmanager.js";
const router = Router()
//const carts = new CartManager()
router.post("/", async (req,res) => {
    //const newCart = carts.createCart()
    //res.status(201).json(newCart)
    const newCart = await cartModel.create({})
    res.status(201).json(newCart)
})
router.get("/:cid", async (req,res) => {
    const {cid} = req.params
    const cart = await cartModel.findById(cid).populate("products.product").lean()
    if (!cart) 
        return res.status(404).json({error:"carrito no encontrado en get"})
    res.json(cart)
})
router.post("/:cid/product/:pid", async (req,res) => {
    /*
    const {cid, pid} = req.params
    const cart = carts.addProductToCart(parseInt(cid), parseInt(pid))
    if (!cart) 
        return res.status(404).json({error:"carrito o producto no encontrado en addProductToCart"})
    res.json(cart)
    */
    const {cid, pid} = req.params
    const cart = await cartModel.findById(cid)
    if (!cart)
        return res.status(404).json({error:"carrito no encontrado"})
    let products = cart.products
    if (!products.find(p => p.product == pid)) {
        products.push({product: pid, quantity: 1})
    }
    else {
        const prod = products.find(p => p.product == pid)
        prod.quantity++
    }
    const updatedCart = await cartModel.findByIdAndUpdate(cid, cart)
    res.json({message:"Producto agregado al carrito", cart: updatedCart})
})
router.delete("/:cid/product/:pid", async (req,res) => {
    const {cid, pid} = req.params
    const cart = await cartModel.findById(cid)
    const products = cart.products
    if(!products.find(p => p.product == pid)) {
        return res.status(404).json({error:"producto no encontrado en el carrito"})
    }
    const updatedProducts = products.filter(p => p.product != pid)
    const updatedCart = await cartModel.findByIdAndUpdate(cid, {products: updatedProducts}, {new: true})
    res.json({message:"Producto eliminado del carrito", cart: updatedCart})
})
router.put("/:cid", async (req,res) => {
    const {cid} = req.params
    const {products} = req.body
    const cart = await cartModel.findById(cid)
    if (!cart){
        return res.status(404).json({error:"carrito no encontrado"})
    }
    const updatedCart = await cartModel.findByIdAndUpdate(cid, {products}, {new: true})
    res.json({message:"Carrito actualizado", cart: updatedCart})
})
router.put("/:cid/product/:pid", async (req,res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body
    const cart = await cartModel.findById(cid)
    if (!cart){
        return res.status(404).json({error:"carrito no encontrado"})
    }
    const product = cart.products.find(p => p.product == pid)
    if (!product){
        return res.status(404).json({error: "producto no encontrado"})
    }
    product.quantity = quantity
    const updatedCart = await cartModel.findByIdAndUpdate(cid, {products: cart.products}, {new: true})
    res.json({message:"Cantidad actualizada", cart: updatedCart})
})
router.delete("/:cid", async (req,res) => {
    const {cid} = req.params
    const cart = await cartModel.findById(cid)
    if (!cart){
        return res.status(404).json({error:"carrito no encontrado"})
    }
    const updatedCart = await cartModel.findByIdAndUpdate(cid, {products: []}, {new: true})
    res.status(200).json({message:"todos los productos eliminados", cart: updatedCart})
})
export default router
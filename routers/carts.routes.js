import { Router } from "express";
import CartManager from "../dao/cartmanager.js";
const router = Router()
const carts = new CartManager()
router.post("/",(req,res) => {
    const newCart = carts.createCart()
    res.status(201).json(newCart)
})
router.get("/:cid",(req,res) => {
    const {cid} = req.params
    const cart = carts.getCartByID(parseInt(cid))
    if (!cart) 
        return res.status(404).json({error:"carrito no encontrado en get"})
    res.json(cart)
})
router.post("/:cid/product/:pid",(req,res) => {
    const {cid, pid} = req.params
    const cart = carts.addProductToCart(parseInt(cid), parseInt(pid))
    if (!cart) 
        return res.status(404).json({error:"carrito o producto no encontrado en addProductToCart"})
    res.json(cart)
})
export default router
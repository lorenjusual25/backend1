import { Router } from "express";
import ProductManager from "../dao/productmanager.js";
const router = Router()
router.get("/realtimeproducts", async (req,res) => {
    const products = await new ProductManager().getProducts()
    res.render("realTimeProducts", {
        products
    })
})
export default router
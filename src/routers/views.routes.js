import { Router } from "express";
import { productModel } from "../model/productModel.js";
import { cartModel } from "../model/cartModel.js";
const limitPerPage = 5
const router = Router()
router.get("/", async (req,res) => {
    const { page = 1 } = req.query
    const pagination = await productModel.paginate({}, {
        limit: limitPerPage,
        page: page,
        sort: {code: 1},
        lean: true
    })
    res.render("realTimeProducts", {
        pagination
    })
})
router.get("/:pid", async (req,res) => {
    const {pid} = req.params
    const product = await productModel.findById(pid).lean()
    if (!product) {
        return res.status(404).json({error:"Producto no encontrado"})
    }
    res.render("details",{
        product
    })
})
router.get("/carts/:cid", async (req,res) => {
    const {cid} = req.params
    const cart = await cartModel.findById(cid).populate("products.product").lean()
    if (!cart) {
        return res.status(404).json({error:"Carrito no encontrado"})
    }
    res.render("viewCart",{
        cart
    })
})
export default router
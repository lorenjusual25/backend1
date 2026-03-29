import { Router } from "express";
import { productModel } from "../model/productModel.js";
const limitPerPage = 5
const router = Router()
router.get("/realtimeproducts", async (req,res) => {
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
export default router
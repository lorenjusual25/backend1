import { Router } from "express";
//import ProductManager from "../dao/productmanager.js";
import { productModel } from "../model/productModel.js";
//import fs from "fs"
const router = Router()
//const products = new ProductManager()
router.get("/", async (req,res) => {
    const { page = 1, limit = 10, query, sort } = req.query
    const filter = query? {category: query} : {}
    const sortOp = sort === "asc" ? {price: 1} : sort === "desc" ? {price: -1} : {}
    const result = await productModel.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOp,
        lean: true
    })
    res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${query?`&query=${query}`:""}${sort?`&sort=${sort}`:""}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${query?`&query=${query}`:""}${sort?`&sort=${sort}`:""}` : null
    })
})

router.get("/:pcode", async (req,res) => {
    /*const productCode = products.getProductByCode(parseInt(req.params.pcode))
    if(!productCode)
        return res.status(404).json({error:"producto no encontrado en get"})
    res.json(productCode)
    */
    const productCode = await productModel.findOne({code: parseInt(req.params.pcode)})
    if(!productCode)
        return res.status(404).json({error:"producto no encontrado en get"})
    res.json(productCode)
})

router.post("/", async (req,res) => {
    /*const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const { title, description, price, thumbnail, stock, status, category } = req.body
    const newProduct = {
        code: productData.length + 1,
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
    res.status(201).json(newProduct)*/
    const { title, description, price, thumbnail, stock, status, category } = req.body
    const count = await productModel.countDocuments()
    const newProduct = await productModel.create({
        code: count + 1,
        title, 
        description, 
        price, 
        thumbnail, 
        stock, 
        status, 
        category
    })
    res.status(201).json(newProduct)
})

router.put("/:pcode", async (req,res) => {
    /*const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const {pcode} = req.params
    const { title, description, price, thumbnail, stock, status, category } = req.body
    const productIndex = productData.findIndex(p => p.code === parseInt(pcode))
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
        code: product.code
    }
    fs.writeFileSync("./products.json",JSON.stringify(productData, null, 2))
    res.json(productData[productIndex])*/
    const update = await productModel.findOneAndUpdate(
        {code:parseInt(req.params.pcode)},
        req.body,
        {new:true}
    )
    if (!update)
        return res.status(404).json({error:"producto no encontrado en put"})
    res.json(update)
})

router.delete("/:pcode", async (req,res) => {
    /*
    const productData = JSON.parse(fs.readFileSync("./products.json","utf-8"))
    const {pcode} = req.params
    const product = productData.find(p => p.code === parseInt(pcode))
    if (!product) 
        return res.status(404).json({error:"producto no encontrado en delete"})
    const updatedData = productData.filter(p => p.code !== parseInt(pcode))
    fs.writeFileSync("./products.json",JSON.stringify(updatedData, null, 2))
    res.json({message:"Producto eliminado"})
    */
    const deleted = await productModel.findOneAndDelete({code:parseInt(req.params.pcode)})
    if (!deleted)
        return res.status(404).json({error:"producto no encontrado en delete"})
    res.json({message:"Producto eliminado"})
})
export default router
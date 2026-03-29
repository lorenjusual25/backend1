import fs from 'fs'
import { __dirname } from '../util.js'
class ProductManager {
    constructor () {
        this.path = __dirname + "/dao/data/products.json"
        this.products = this.cargar()
    }
    cargar() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path, "utf-8")
                return JSON.parse(data)
            }
            return []
        }
        catch (error) {
            console.error("Error al cargar los productos:", error)
            return []
        }
    }
    guardar() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
        }
        catch (error) {
            console.error("Error al guardar los productos:", error)
        }
    }
    addProduct (product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || product.status === undefined || product.status === null || !product.category) {
            console.error("Faltan campos")
            return
        }
        if (this.products.some(p => p.code === product.code)){
            console.error("CODE repetido")
            return
        }
        this.products.push(product)
        this.guardar()
    }
    getProducts() {
        return this.products
    }
    getProductByCode (code) {
        const producto = this.products.find(p => p.code === code)
        if (!producto){
            console.error("not found")
            return
        }
        return producto
    }
    createProduct (product) {
        const maxCode = this.products.reduce((max, p) => Math.max(max, p.code || 0), 0)
        const newProduct = {
            code: maxCode + 1,
            ...product
        }
        this.products.push(newProduct)
        this.guardar()
        return newProduct
    }
    deleteProduct (code) {
        const previoLength = this.products.length
        this.products = this.products.filter(p => p.code !== code)
        if (this.products.length === previoLength) {
            console.error("Producto no encontrado")
            return false
        }
        this.guardar()
        return true
    }
}
export default ProductManager
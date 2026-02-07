import fs from 'fs'
class ProductManager {
    constructor () {
        this.path = "./products.json"
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
    addProduct (product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.id || !product.stock || !product.status || !product.category) {
            console.error("Faltan campos")
            return
        }
        if (this.products.some(p => p.id === product.id)){
            console.error("ID repetido")
            return
        }
        this.products.push(product)
    }
    getProducts() {
        return this.products
    }
    getProductByID (id) {
        const producto = this.products.find(p => p.id === id)
        if (!producto){
            console.error("not found")
            return
        }
        return producto
    }
}
export default ProductManager
/*let i = 0
let prod = new ProductManager()
prod.addProduct({
    title: "titulo1",
    description: "desc1",
    price: 1,
    thumbnail: "tn1",
    id: ++i,
    stock: 1
})
prod.addProduct({
    title: "titulo2",
    description: "desc2",
    price: 2,
    thumbnail: "tn2",
    id: ++i,
    stock: 2
})
prod.addProduct({
    title: "titulo3",
    description: "desc3",
    price: 3,
    thumbnail: "tn3",
    id: ++i,
    stock: 3
})
console.log(prod.getProducts())
prod.getProductByID(5)*/
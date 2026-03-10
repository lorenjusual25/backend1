import fs from "fs"
import { __dirname } from "../util.js"
class CartManager {
    constructor() {
        this.path = __dirname + "/data/carts.json"
        this.carts = this.cargar()
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
            console.error("Error al cargar el carrito:", error)
            return []
        }
    }
    createCart() {
        const newCart = {
            id: this.carts.length + 1,
            products: []
        }
        this.carts.push(newCart)
        this.guardar()
        return newCart
    }
    getCartByID(id) {
        const cart = this.carts.find(c => c.id === id)
        if (!cart) {
            console.error("Carrito no encontrado")
            return null
        }
        return cart
    }
    guardar() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.error("Error al guardar el carrito:", error)
        }
    }
    addProductToCart(cartId, productId) {
        const cart = this.getCartByID(cartId)
        if (!cart) {
            console.error("Carrito no encontrado")
            return null
        }
        const productInCart = cart.products.find(p => p.product === productId)
        if (productInCart) {
            productInCart.quantity++
        } else {
            cart.products.push({ product: productId, quantity: 1 })
        }
        this.guardar()
        return cart
    }
}
export default CartManager
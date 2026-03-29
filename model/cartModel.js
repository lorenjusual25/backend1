import { Schema, model, Types } from "mongoose"
const cartSchema = new Schema({
    products: {
        type: [{
            quantity: Number,
            product: {
                type: Types.ObjectId,
                ref: "product"
            }
        }],
        default: []
    },
})
//Lo tuve que comentar ya que por alguna razon al guardar el mismo producto en el carrito, se me creaba como uno nuevo
//y no se me actualizaba la cantidad
//cartSchema.pre("findOne", function() {
//    this.populate("products.product")
//})
export const cartModel = model("cart", cartSchema)
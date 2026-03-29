import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const productSchema = new Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    stock: Number,
    status: Boolean,
    category: String
})
productSchema.plugin(mongoosePaginate)
export const productModel = model("product", productSchema)
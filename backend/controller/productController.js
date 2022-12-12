
const AsyncHandler = require("express-async-handler");
const { ProductModel } = require("../models/productModel");

const createProduct = AsyncHandler( async(req,res) => {
    const {name , sku , category , quantity , price , description } = req.body;

    // Validation
    if(!name || !category || !quantity || !price || !description){
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    // Manage Image upload


    // Create Product
    const product = await ProductModel.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description
    })
    res.status(200).json(product)
});

module.exports = {
    createProduct
}
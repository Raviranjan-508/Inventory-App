
const AsyncHandler = require("express-async-handler");
const { ProductModel } = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;


const createProduct = AsyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    // Validation
    if (!name || !category || !quantity || !price || !description) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
        // Save image to loudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Medical Management App", resource_type: "image" })
        } catch (error) {
            res.status(500)
            throw new Error(" Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.SECURE_URL,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }
    // Create Product
    const product = await ProductModel.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    })
    res.status(201).json(product)
});

// Get all product
const getProducts = AsyncHandler(async (req, res) => {
    const products = await ProductModel.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(products)
})

// Get single Product
const getProduct = AsyncHandler(async (req, res) => {
    // res.send("Single Product")
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    res.status(200).json(product)
})

// Delete product through Id
const deleteProduct = AsyncHandler(async (req, res) => {
    // res.send("Single Product")
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    await product.remove();
    res.status(200).json(product)
})

// Update Product
const updateProduct = AsyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    // If product doesn't exists
    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }
    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
        // Save image to loudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Medical Management App", resource_type: "image" })
        } catch (error) {
            res.status(500)
            throw new Error(" Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.SECURE_URL,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        { _id: id },
        {
            name,
            sku,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ? product?.image : fileData,
        },
        {
            new: true,
            runValidators : true
        }
    )

    res.status(201).json(updatedProduct)
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}
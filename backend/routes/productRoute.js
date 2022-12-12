
const { Router } = require("express");
const { createProduct } = require("../controller/productController");
const { protect } = require("../middleWare/authMiddlewre");
const productRouter = Router();


productRouter.post("/api/products", protect , createProduct);

module.exports = {
    productRouter
}
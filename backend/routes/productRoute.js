
const { Router } = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controller/productController");
const { protect } = require("../middleWare/authMiddlewre");
const { upload } = require("../utils/fileUpload");
upload
const productRouter = Router();


productRouter.post("/api/products", protect , upload.single("image"), createProduct);
productRouter.patch("/api/products/:id", protect , upload.single("image"), updateProduct);
productRouter.get("/api/products", protect , getProducts );
productRouter.get("/api/products/:id", protect , getProduct);
productRouter.delete("/api/products/:id", protect , deleteProduct);


module.exports = {
    productRouter
}
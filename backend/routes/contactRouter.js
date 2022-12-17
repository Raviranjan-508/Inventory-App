

const {Router} = require("express");
const { contactUs } = require("../controller/contactController");
const { protect } = require("../middleWare/authMiddlewre");

const contactRouter = Router();

contactRouter.post("/api/contact", protect , contactUs);

module.exports = {
    contactRouter
}
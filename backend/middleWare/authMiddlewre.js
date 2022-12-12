const asyncHaandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");


const protect = asyncHaandler(async(req,res , next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        //Verify Token
        const verified = jwt.verify(token , process.env.SECRET)
        // Get user id from token
        user = await userModel.findById(verified.id).select("-password");

        if(!user){
            res.status(401)
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error("not authorized, please login")
    }
})


module.exports = {protect} ;
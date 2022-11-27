const { userModel } = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemon = require("nodemon");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "1d"
    })
}



const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please filled in all required fields")
    }

    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be upto 6 chracters")
    }

    // Check if user email already exists
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("user email already exists, please enter new email")
    }

    // Create new Users
    const user = await userModel.create({
        name,
        email,
        password
    });

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user) {
        const { _id, name, email, password, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, password, photo, phone, bio, token
        })
    }
    else {
        res.status(400)
        throw new Error(" Invalid User data ")
    }
}

module.exports = {
    registerUser
}
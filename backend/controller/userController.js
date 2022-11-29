const { userModel } = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "1d"
    })
}

const registerUser = asyncHandler(async (req, res) => {
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

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

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
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password")
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    console.log(user)

    // checckPassword
    const passworddIsCorrect = await bcrypt.compare(password, user.password);

    if (user && passworddIsCorrect) {
        const { _id, name, email, password, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, password, photo, phone, bio
        })
    }
    else {
        res.status(400)
        throw new Error(" Invalid email or password ")
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true,
    });
    return res.status(200).json({ messge: "Logout Successfully" })
})

const getUser = asyncHandler(async (req, res) => {
    res.send("User is here");
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}
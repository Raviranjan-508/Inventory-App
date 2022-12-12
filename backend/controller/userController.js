const { userModel } = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { TokenModel } = require("../models/tokenModel");
const { sendEmail } = require("../utils/sendEmail");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "1d"
    });
};

// Register User
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

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: false,
    });

    console.log(token)

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

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password")
    }

    const user = await userModel.findOne({ email });
    console.log(user)

    // checkPassword
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

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 0 means just remove cookies
        sameSite: "none",
        secure: false,
    });
    return res.status(200).json({ messge: "Logout Successfully" })
})

// Get User
const getUser = asyncHandler(async(req,res) => {
    res.send("User is here");
    const user = await userModel.findById(req.user._id);

    if (user) {
        const { _id, name, email, password, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, password, photo, phone, bio
        })
    }
    else {
        res.status(400)
        throw new Error(" Invalid User data ")
    }
})

// Login Status
const loginStatus = asyncHandler(async(req,res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json(false)
    }
    const verified = jwt.verify(token, process.env.SECRET);
    if(verified){
        return res.json(true)
    }
    return res.json(false)
})

// Update User
const updateUser = async(req,res) => {
    const user = await userModel.findById(req.user._id);

    if(user){
        const {  name, email , photo, phone, bio } = user;
        user.email = email ;
        user.name = req.body.name || name ;
        user.phone = req.body.phone || phone ;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updateUser.name,
            email: updateUser.email,
            photo: updateUser.photo,
            phone: updateUser.phone,
            bio: updateUser.bio,
        })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
    res.send("User Updated")
}

// Change Password
const changepassword = asyncHandler(async(req,res) => {
    const user = await userModel.findById(req.user._id);
    const {oldPassword , password } = req.body;

    if(!user){
        res.status(400)
        throw new Error("Please add old and new password")
    }

    //validate
    if(!oldPassword || !password){
        res.status(400)
        throw new Error("Please add old and new password")
    }

    // check if old password matches password in DB

    //Here comparing oldPassword that is enter by user it is same as that is present in database or not
    const passwordIsCorrect = await bcrypt.compare(oldPassword , user.password)

    // Save new password
    if( user && passwordIsCorrect){
        user.password = password
        await user.save()
        res.status(200).send("Password change successfully")
    } else {
        res.status(400)
        throw new Error("Old password is incorrect");
    }
})

// Forgot Password
const forgotPassword = asyncHandler (async(req,res) => {
    const {email} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        res.status(404)
        throw new Error("User doesn't exists");
    }

    // Create Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id

    // Hash token before saving to DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // console.log(hashedToken);

    // Save Token to DB
    await new TokenModel({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 40 * (60 * 1000) // Thirty minutes
    }).save()

    // Construct Reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset Email
    const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is valid for only 30 minutes</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>JPS Hospital<p>
    `;

    const subject = "Password Reset Request"
    const send_to = user.email
    const sent_from = process.env.EMAIL_USER

    try {
        await sendEmail(subject , message , send_to , sent_from)
        res.status(200).json({success: true , message: "Reset Email Sent"})
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please try again")
    }

    console.log(resetToken)
    res.send("Forgot Password")
})

// Reset Password
const resetPassword = asyncHandler (async(req,res) => {
    res.send("Reset Password");

    const {password} = req.body;
    const {resetToken} = req.params;

    // Hash token, then compare to Token in DB
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    // Find token in DB
    const userToken = await TokenModel.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
    })

    if(!userToken){
        res.status(400);
        throw new Error("Invalid or Expired Token");
    }

    // Find user
    const user = await userModel.findOne({
        _id: userToken.userId
    })
    user.password = password
    await user.save()
    await user.save()
    res.status(200).json({
        message: "Password Reset Successful, Please Login"
    })
})


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changepassword,
    forgotPassword,
    resetPassword
}
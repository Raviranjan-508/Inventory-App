const { Router } = require('express');
const { registerUser, loginUser } = require('../controller/userController');

const userRouter = Router();

userRouter.post("/api/users/register", registerUser);
userRouter.post("/api/users/login", loginUser);

module.exports = {
    userRouter
}
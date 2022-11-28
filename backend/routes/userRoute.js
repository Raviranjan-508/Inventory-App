const { Router } = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controller/userController');

const userRouter = Router();

userRouter.post("/api/users/register", registerUser);
userRouter.post("/api/users/login", loginUser);
userRouter.post("/api/users/logout", logoutUser);
userRouter.post("/api/users/getUser", getUser);

module.exports = {
    userRouter
}
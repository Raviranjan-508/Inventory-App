const { Router } = require('express');
const { registerUser } = require('../controller/userController');

const userRouter = Router();

userRouter.post("/api/users/register", registerUser);

module.exports = {
    userRouter
}
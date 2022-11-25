const { Router } = require('express');
const Router = require('express');
const { registerUser } = require('../controller/userController');

const userRouter = Router();

userRouter.post("/register", registerUser);
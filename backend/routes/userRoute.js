const { Router } = require('express');
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, changepassword, forgotPassword } = require('../controller/userController');
const { protect } = require('../middleWare/authMiddlewre');
// const { protect } = require('../middleWare/authMiddlewre');


const userRouter = Router();

userRouter.post("/api/users/register", registerUser);
userRouter.post("/api/users/login", loginUser);
userRouter.post("/api/users/logout", logoutUser);
userRouter.get("/api/users/getuser",protect  , getUser);
userRouter.get("/api/users/loggedin", loginStatus);
userRouter.patch("/api/users/updateuser", protect , updateUser);
userRouter.patch("/api/users/changepassword", protect , changepassword);
userRouter.post("/api/users/forgotpassword", forgotPassword);
userRouter.put("/api/users/resetpassword/:resetToken")

module.exports = {
    userRouter
}
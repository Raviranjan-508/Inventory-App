const { userModel } = require("../models/userModel");
const bcrypt = require('bcrypt');



const registerUser = async(req,res) => {
    const { name ,  email , password  } = req.body;
    
    // Validation
    if( !name || !email || !password ){
        res.status(400)
        throw new Error("Please filled in all required fields")
    }

    if( password.length < 6 ){
        res.status(400)
        throw new Error("Password must be upto 6 chracters")
    }

    // Check if user email already exists
    const userExists = await userModel.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("user email already exists, please enter new email")
    }

    bcrypt.hash(password , 6).then(async function(hash){
        const user = await userModel.create({
            name,
            email,
            password : hash
        });

        if(user){
            const { _id , name , email , password , photo , phone , bio } = user;
            res.status(201).json({
                _id , name , email , password , photo , phone , bio
            })
        }
        else{
            res.status(400)
            throw new Error(" Invalid User data ")
        }
    })

    // Create new Users
       
}

module.exports = {
    registerUser
}
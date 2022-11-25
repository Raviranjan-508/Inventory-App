const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Character length should be upto 6 chracters"],
        maxLength: [23, "Chracter should not be more than 23 chracters"]
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: ""
    },
    phone: {
        type : String,
        default : "+234"
    },
    bio: {
        type : String,
        maxLength : [250 , "Bio must be more than 250 chracters"],
        default : "bio"
    }
})

const userModel = mongoose.model("User", userSchema);

module.exports = {
    userModel
}
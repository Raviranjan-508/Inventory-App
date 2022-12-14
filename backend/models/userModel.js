const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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
        minLength: [6, "Character length should be upto 6 chracters"]
        // maxLength: [23, "Chracter should not be more than 23 chracters"]
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
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
});

// Encrypt password before sending into the DB
userSchema.pre("save", async function(next){

    if(!this.isModified("password")) {
        return next()
    }
    // Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password , salt);
    this.password = hashedPassword;
})

const userModel = mongoose.model("User", userSchema);

module.exports = {
    userModel
}
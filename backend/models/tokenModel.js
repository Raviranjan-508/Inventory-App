const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
})

const TokenModel = mongoose.model("Token" , tokenSchema);

module.exports = {
    TokenModel
}
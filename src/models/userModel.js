const mongoose = require("mongoose");



const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    }
}, { _id: false })

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: addressSchema
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
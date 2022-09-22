const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: objectId,
        ref: "Book",
        required: true,
        trim: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest",
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Review", reviewSchema)

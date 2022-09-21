const mongoose = require("mongoose");
<<<<<<< HEAD
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: 'Book'
=======
const objectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: objectId,
        ref: "books",
        required: true
>>>>>>> ca072f8e9ff852d65d6ae0d8d482aadcd7a9655a
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest"
    },
    reviewedAt: {
<<<<<<< HEAD
        type: Date
=======
        type: Date,
        required: true
>>>>>>> ca072f8e9ff852d65d6ae0d8d482aadcd7a9655a
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
<<<<<<< HEAD
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)  
=======
});


module.exports = mongoose.model("review", reviewSchema)
>>>>>>> ca072f8e9ff852d65d6ae0d8d482aadcd7a9655a

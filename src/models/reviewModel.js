const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

    bookId:{
        type:ObjectId,
        ref:'group30Database'
    },
    reviewedBy:{
        type:String,
        require:true,
        default:"Guest"
    },
    reviewedAt:{
        type:Date
    },
    rating:{
        type:Number,
        require:true
    },
    review:{
        type:String
    },
    isDeleted:{
         type:Boolean,
          default:false
         }
})
const mongoose = require('mongoose')
const stringChecking = function (data) {
    if (typeof data !== 'string') {
        return false;
    } else if (typeof data === 'string' && data.trim().length === 0) {
        return false;
    } else {
        return true;
    }
}

const arrayOfStringChecking = function (data) {
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'string') {
            return false;
        } else if (typeof data[i] === 'string' && data[i].trim().length == 0) {
            return false;
        }
    }
    return true
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

const validDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/


module.exports = { stringChecking, isValidObjectId, validISBN, arrayOfStringChecking, validDate}
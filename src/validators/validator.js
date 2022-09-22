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


const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/ //-------------> for 10 or 13
///^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/ -------------> for 13 only
///(?:-13)?:?\x20*(?=.{17}$)97(?:8|9)([ -])\d{1,5}\1\d{1,7}\1\d{1,6}\1\d$/
///^(97(8|9))?\d{9}(\d|X)$/




const validDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/


module.exports = { stringChecking, isValidObjectId, validISBN, validDate}
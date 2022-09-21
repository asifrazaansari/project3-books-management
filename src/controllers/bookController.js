const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { stringChecking, isValidObjectId, validISBN, arrayOfStringChecking, validDate } = require('../validators/validator')
const moment = require('moment');
const today = moment()

const createBook = async function (req, res) {
    try {
        const booksData = req.body

        if (Object.keys(booksData).length === 0) {
            return res.status(400).send({ status: false, msg: "Please enter required details in request body" })
        }

        const { title, excerpt, userId, ISBN, category, subcategory } = booksData

        if (!stringChecking(title)) return res.status(400).send({ status: false, message: "title must be present with non-empty string" })
        const duplicateTitle = await bookModel.findOne({title: title})
        if(duplicateTitle) return res.status(400).send({ status: false, message: "Title must be unique" })

        if (!stringChecking(excerpt)) return res.status(400).send({ status: false, message: "excerpt must be present with non-empty string" })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId must be valid, please write in correct format" })

        const validUserId = await userModel.findOne({ _id: userId })
        if (!validUserId) return res.status(401).send({ status: false, message: "user is not valid please provide valid userId" })

        if (!validISBN.test(ISBN)) return res.status(400).send({ status: false, message: "ISBN must be present and valid, please write in 10 or 13 digit format" })

        const duplicateISBN = await bookModel.findOne({ ISBN: ISBN })
        if(duplicateISBN) return res.status(400).send({ status: false, message: "ISBN must be unique" })

        if (!stringChecking(category)) return res.status(400).send({ status: false, message: "category must be present with non-empty string" })

        if (!arrayOfStringChecking(subcategory)) return res.status(400).send({ status: false, message: "subcategory must be present with non-empty string" })

        booksData.releasedAt = today.format('YYYY-MM-DD')

        const book = await bookModel.create(booksData)
        return res.status(201).send({ status: false, message: "Book Created successfully", data: book })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }

}

const getBooks = async function (req, res) {
    try {
        const booksData = req.query

        const { userId, category, subcategory } = booksData

        const filter = {}

        if (userId) {
            const usersId = await userModel.findOne({_id: userId})
            if(!usersId) return res.status(400).send({status: false, message: "Provide correct userId"})
            filter.userId = usersId
        }

        if (category) {
            filter.category = category
        }

        if (subcategory) {
            filter.subcategory = category
        }

        filter.isDeleted = false

        const getAllBooks = await bookModel.find(filter).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

        if (getAllBooks.length === 0) return res.status(404).send({ status: false, message: "No books found" })

        return res.status(200).send({ status: true, message: "Success", data: getAllBooks })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }



}
const completeBookDetails = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId must be present and  valid, please write in correct format" })

        const bookDetails = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookDetails) return res.status(404).send({ status: false, message: "No Book Found" })

        const reviewsData = await reviewModel.find({ bookId: bookDetails._id })

        const data = { bookDetails, reviewsData }
        return res.status(200).send({ status: true, message: "Success", count: reviewsData, data: data })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }


}
const updateBook = async function (req, res) {
    try {
        let book = await bookModel.findById(req.params.bookId)
        if (book.isDeleted === true) return res.status(400).send({ status: false, message: "This book is already deleted." })

        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Provide the data in the body to update." })
        let { title, excerpt, releasedAt, ISBN } = data

        if (title) {
            let titlePresent = await bookModel.findOne({ title: title })
            if (titlePresent) return res.status(400).send({ status: false, message: "title is not unique, please provide another one." })
        }
        if (ISBN) {
            ISBN = ISBN.replace(/-/g, '')
            if (!validISBN.test(ISBN))
                return res.status(400).send({ status: false, message: "This ISBN is not valid" })
            let isbnPresent = await bookModel.findOne({ ISBN: ISBN })
            if (isbnPresent) return res.status(400).send({ status: false, message: "ISBN number is not unique." })
        }
        if (releasedAt) {
            if (!validDate.test(releasedAt))
                return res.status(400).send({ status: false, message: 'Please enter the releasedAt date in "YYYY-MM-DD" format' })
        }

        let updatedBook = await bookModel.findOneAndUpdate(
            { _id: req.params.bookId },
            { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } },
            { new: true }
        )
        return res.status(200).send({ status: true, message: 'Success', data: updatedBook })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }


}

const deleteById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId must be present and valid, please write in correct format" })
        let book = await bookModel.findById(bookId)
        if (book.isDeleted === true) return res.status(400).send({ status: false, message: "This book is already deleted." })

        await bookModel.findOneAndUpdate(
            { _id: bookId },
            { isDeleted: true, deletedAt: Date.now() }
        )
        return res.status(200).send({ status: true, message: "Book deleted succesfully." })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createBook, getBooks, completeBookDetails, updateBook, deleteById }
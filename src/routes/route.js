const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require('../controllers/bookController')


router.post("/login", userController.userLogin)
router.post("/register", userController.createUser);


router.post('/books', bookController.createBook)
router.get('/books', bookController.getBooks)
router.get('/books/:bookId', bookController.completeBookDetails)
router.put('/books/:bookId', bookController.updateBook)
router.delete('/books/:bookId', bookController.deleteById)


module.exports = router;
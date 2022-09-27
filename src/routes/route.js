const express = require("express");
const router = express.Router();
const { createUser, userLogin } = require("../controllers/userController");
const { createBook, getBooks, getBookById, updateBook, deleteById } = require('../controllers/bookController')
const { authentication, authorization } = require('../middlewares/auth');
const { createReview, updateReview, deleteReview } = require("../controllers/reviewController");


router.post("/register", createUser);
router.post("/login", userLogin)


router.post('/books', authentication, createBook)
router.get('/books', authentication, getBooks)
router.get('/books/:bookId', authentication, getBookById)
router.put('/books/:bookId', authentication, authorization, updateBook)
router.delete('/books/:bookId', authentication, authorization, deleteById)


router.post("/books/:bookId/review", createReview);
router.put("/books/:bookId/review/:reviewId", updateReview);
router.delete("/books/:bookId/review/:reviewId", deleteReview);



module.exports = router;
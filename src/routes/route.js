const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require('../controllers/bookController')
const { authentication, authorization } = require('../middlewares/auth')


router.post("/login", userController.userLogin)
router.post("/register", userController.createUser);


router.post('/books', authentication, bookController.createBook)
router.get('/books', authentication, bookController.getBooks)
router.get('/books/:bookId', authentication, bookController.getBookById)
router.put('/books/:bookId', authentication, authorization, bookController.updateBook)
router.delete('/books/:bookId', authentication, authorization, bookController.deleteById)


module.exports = router;
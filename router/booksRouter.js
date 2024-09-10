import express from 'express'
import { getBooks, createNewBook, deleteBookById, editBookById, getBookById, getFilterBooks, } from '../controller/bookController.js'

const bookRouter = express.Router()

// bookRouter.get("/books", getBooks)
bookRouter.get("/books/:id", getBookById)
bookRouter.post("/books/create", createNewBook)
bookRouter.patch("/books/book/:id", editBookById)
bookRouter.delete("/books/book/:id", deleteBookById)
bookRouter.get("/books", getFilterBooks)

export default bookRouter
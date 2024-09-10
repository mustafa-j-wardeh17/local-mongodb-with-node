import { ObjectId } from "mongodb";
import { connectToDb, getDb } from "../util/db.js";



//--------------------------------------------
//-------------- Get All Books ---------------
//--------------------------------------------
export const getBooks = async (req, res) => {
    try {
        await connectToDb(); // Ensure the database is connected
        const db = getDb();

        const books = await db.collection('books').find().toArray();
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching books", err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
}

//--------------------------------------------
//-------------- Get Book By Id --------------
//--------------------------------------------
export const getBookById = async (req, res) => {
    const bookId = req.params.id;
    try {
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid book ID' }); // Return a 400 Bad Request for invalid IDs
        }
        await connectToDb();
        const db = getDb();
        const book = await db.collection('books').findOne({
            _id: new ObjectId(bookId) // Use 'new' keyword to create an ObjectId instance
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' }); // Return a 404 Not Found if no book is found
        }

        res.status(200).json(book); // Return the found book
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).json({ error: "Failed to fetch book" });
    }
};


//--------------------------------------------
//------------- Create New Book --------------
//--------------------------------------------
export const createNewBook = async (req, res) => {
    const { title, author, pages, genres, rating, reviews } = req.body
    try {
        if (!title || !author || !pages || !genres || !rating || !reviews) {
            return res.status(400).json({ error: 'All Fileds Required' });
        }

        await connectToDb();
        const db = getDb();

        const data = await db.collection('books').insertOne({
            author,
            title,
            pages,
            genres,
            rating,
            reviews
        })

        res.status(200).json({
            result: 'success',
            message: "book created successfully",
            data
        }); // Return the found book
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).json({ error: "Failed to fetch book" });
    }
};

//--------------------------------------------
//---------------- Edit Book -----------------
//--------------------------------------------
export const editBookById = async (req, res) => {
    const bookId = req.params.id; // Extract bookId from params
    const data = req.body; // Extract data from request body

    try {
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid Book ID' }); // Return 400 for invalid IDs
        }

        await connectToDb(); // Ensure the database is connected
        const db = getDb(); // Get the database instance

        const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' }); // Return 404 if no book is found
        }

        const result = await db.collection('books').updateOne(
            { _id: new ObjectId(bookId) },
            { $set: { ...data } } // Spread the data into the $set operator
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ result: 'failed', message: 'Book not found for update' });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).json({
                result: 'success',
                message: 'No changes were necessary'
            });
        }

        res.status(200).json({
            result: 'success',
            message: 'Book updated successfully'
        });
    } catch (error) {
        console.error("Error updating book", error); // Log error for debugging
        res.status(500).json({
            result: 'failed',
            error: "Failed to update book"
        });
    }
};


//--------------------------------------------
//--------------- Delete Book ----------------
//--------------------------------------------
export const deleteBookById = async (req, res) => {
    const bookId = req.params.id; // Extract bookId from params

    try {
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid Book ID' }); // Return 400 for invalid IDs
        }

        await connectToDb(); // Ensure the database is connected
        const db = getDb(); // Get the database instance

        const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' }); // Return 404 if no book is found
        }

        const result = await db.collection('books').deleteOne(
            { _id: new ObjectId(bookId) },
        );


        res.status(200).json({
            result: 'Success',
            message: 'Book Deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting book", error); // Log error for debugging
        res.status(500).json({
            result: 'failed',
            error: "Failed to delete book"
        });
    }
};

//--------------------------------------------
//-------------- Get All Books ---------------
//--------------------------------------------
export const getFilterBooks = async (req, res) => {
    const page = req.query.page || 1
    const search = req.query.search || ''
    const itemsPerPage = 3
    // Create a filter for the search term if provided
    const searchFilter = search ?
        {
            $or: [
                {
                    title: { $regex: search, $options: 'i' }
                },
                {
                    author: { $regex: search, $options: 'i' }
                }
            ]
        }
        : {};
    try {
        await connectToDb(); // Ensure the database is connected
        const db = getDb();

        const books = await db.collection('books').find(searchFilter).skip((page - 1) * itemsPerPage).limit(itemsPerPage).toArray();
        res.status(200).json(books);
    } catch (err) {
        console.error("Error fetching books", err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
}
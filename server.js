import express from 'express';
import bookRouter from './router/booksRouter.js';
import { connectToDb, getDb } from './util/db.js';

const app = express();
const PORT = 5000; // Define a constant for the port number

//To add data in body
app.use(express.json())
// Connect to the database
const startServer = async () => {
    try {
        await connectToDb(); // Ensure the database is connected
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to the database", err);
        process.exit(1); // Exit the process with an error code
    }
};

startServer(); // Call the function to start the server

// Routes
app.use('/v1', bookRouter);

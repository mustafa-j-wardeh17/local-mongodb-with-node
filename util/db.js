// utils/db.js

import { MongoClient } from 'mongodb';

let dbConnection;
let client;

export const connectToDb = async () => {
  if (dbConnection) {
    // Return the existing connection if it already exists
    return dbConnection;
  }

  try {
  
    client = await MongoClient.connect("mongodb://localhost:27017/bookstore");

    dbConnection = client.db();
    console.log("Successfully connected to MongoDB");
    return dbConnection;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err; // Ensure error is thrown to handle it appropriately
  }
};

export const getDb = () => {
  if (!dbConnection) {
    throw new Error("No database connection. Please call connectToDb first.");
  }
  return dbConnection;
};

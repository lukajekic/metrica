
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectDB() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("MONGO -- OK");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB
const mongoose = require("mongoose");
const updateExistingUsers = require("./migrations/teacherStudentData");
require("dotenv").config();

// Function to connect to the database
async function connectToDB() {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const pw = encodeURIComponent(process.env.MONGODB_PW);
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri.replace("<MONGODB_PW>", pw), connectionParams);
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Function to run the script after connecting to the database
async function runScript() {
  await connectToDB(); // Connect to the database
  await updateExistingUsers(); // Run the update script

  mongoose.connection.close(); // Close the database connection when done
}

runScript(); // Start the script

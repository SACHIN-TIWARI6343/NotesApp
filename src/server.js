const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file


const app = require('./app'); // Import the Express app
const connectDB = require('./config/db'); // Import the database connection function


const PORT = process.env.PORT ; // Get the port from environment variables or use default

// Connect to the database before starting the server

const startServer = async ()=>{
    await connectDB(); // Connect to the database
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} 

startServer(); // Call the function to start the server
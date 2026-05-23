const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const loginUser = async (email, password) => {

    // Find user
    const user = await User.findOne({
        email: email.toLowerCase()
    });


    // Check user exists
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    // Password mismatch
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return result
    return {
        token,
        user
    };
};


const  RegisterUser = async (email, password) =>{
  
    // Check if user already exists
    const existingUser = await User.findOne({
        email: email.toLowerCase()
    });
    
    if (existingUser) {
        return true; // User already exists
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    await User.create({
        email: email.toLowerCase(),
        passwordHash: passwordHash
    });
}

module.exports = {
    loginUser,
    RegisterUser
};

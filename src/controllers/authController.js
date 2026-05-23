const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const { loginUser,RegisterUser } = require("../services/authService.js");

const register = async (req, res) => {
  try {
    // request body parsing 
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    
    // check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // for password strength, we can check for minimum length and at least one number
    if (password.length < 6 || !/\d/.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and contain at least one number",
      });
    }

    // bussiness logic for user registration
     const userExists = await RegisterUser(email, password);
    
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Success response formating 
    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body; // data parse from request body


        //  validation check for email and password presence
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

       // trim email  to remove leading and trailing whitespace
        const trimmedEmail = email.trim();
        

   
       
        // check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        // check password strength
        if (password.length < 6 || !/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long and contain at least one number",
            });
        }


        // call service 
        const result = await loginUser(trimmedEmail, password);
        
         
        // response formating 

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
        });


    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


module.exports = {
  register,
  login
};
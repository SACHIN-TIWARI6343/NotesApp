const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


const register = async (req, res) => {
  try {
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


    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    // Note: We store the email in lowercase to ensure uniqueness and consistency
    await User.create({
      email: email.toLowerCase(),
      passwordHash: passwordHash
    });

    // Success response
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
        const { email, password } = req.body;


        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

       // trim email  as well as password to remove leading and trailing whitespace
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


        // Check  const user = await User.find
        const user = await User.findOne({
            email: email.toLowerCase()
        })
       
        // if user not found
        if(!user){
          return res.status(401).json({
             message: "Invalid email or password"
          })
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Generate token
        const token = generateToken(user._id);

        // Success response
        return res.status(200).json({
            message: "Login successful",
            token,
        });




    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


module.exports = {
  register,
  login,
};
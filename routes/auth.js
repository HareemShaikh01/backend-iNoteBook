import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";
import { check, validationResult } from "express-validator";
import fetchUser from "../middlewares/fetchUser.js";

dotenv.config(); // Load environment variables

const router = express.Router();


/// route for signup : POST req "/auth/signup" :no authentication required
router.post(
  "/signup",
  [
    check("name", "Name must be at least 6 characters long").isLength({ min: 6 }),
    check("email", "Invalid email format").isEmail(),
    check("password", "Password must be at least 8 characters long").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false,message: "User with this email already exists" });
      }

      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user with hashed password
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      // Generate JWT Token
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({success:true, message: "User created successfully", token });
    } catch (error) {
      res.status(500).json({success:true, message : "Internal server error", details: error.message });
    }
  }
);


/// endpoint for login : POST request : authentication required
router.post(
  "/login",
  [
    check("email", "Invalid email format").isEmail(),
    check("password", "Password must be at least 8 characters long").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, message:"Invalid credentials", errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if user already exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success:false ,message: "Please enter correct credentials" });
      }

      const comparePassword = await bcrypt.compare(password,user.password);

      if (!comparePassword) {
        return res.status(400).json({ success:false, error: "Please enter correct credentials" });
      }

      // Generate JWT Token
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({success:true, message: "Logged in successfully", token });
    } catch (error) {
      res.status(500).json({ success:false, message: "Internal server error", details: error.message });
    }
  }
);


/// Route:3 getUser using jwt token : authentication required

router.get("/getUser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(404).json({ success:false,message: "User not found" });
    }
    
    res.json({success:true, user});
  } catch (error) {
    res.status(500).json({ success:false, message: "Internal server error", details: error.message });
  }
});



export default router;




/// to enforce uniqueness
       /* await User.collection.dropIndexes();
        console.log("Dropped existing indexes");
    
        // Recreate indexes
        await User.syncIndexes();
        console.log("Recreated indexes");*/
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const fetchUser = (req, res, next) => {
    // Extract token from the custom "auth-token" header
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //  console.log("Decoded Token:", decoded);

        // Attach user data to request
        req.user = decoded; // Now req.user contains { userId, email, iat, exp }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ success:false, message : "Invalid or expired token" });
    }
};

export default fetchUser;

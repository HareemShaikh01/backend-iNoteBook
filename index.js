import connectDB from "./db.js";
import express from "express";
import authrouter from "./routes/auth.js";
import notesrouter from "./routes/notes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Use correct CORS settings
app.use(cors({
    origin: "https://frontend-i-note-book.vercel.app",  // Allow frontend
    credentials: true,  // Allow cookies & headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow methods
    allowedHeaders: ["Content-Type", "auth-token"]  // Allow these headers
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Middleware to parse JSON
app.use(express.json());

connectDB();

// ✅ Test route to check backend
app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.use("/auth", authrouter);
app.use("/notes", notesrouter);

// ✅ Set PORT for Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

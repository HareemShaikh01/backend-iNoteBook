import connectDB from "./db.js";
import express from "express";
import authrouter from "./routes/auth.js";
import notesrouter from "./routes/notes.js"
import cors from "cors"

const app = express();

app.use(cors({
    origin: "https://frontend-inotebook.vercel.app",  // Allow frontend
    credentials: true,  // Allow cookies & headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow methods
    allowedHeaders: ["Content-Type", "auth-token"]  // Allow these headers
}));

// ✅ Handle preflight requests
app.options("*", cors());




connectDB();

/// basic express app setup
app.use(express.json()) // allow json requests/responses

app.get('/',(req,res)=>{
    res.send("hello world")
})

app.use('/auth',authrouter);  /// routes with prefix "/auth" : basically a middleware
app.use('/notes',notesrouter);  /// routes with prefix "/auth" : basically a middleware


app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
})
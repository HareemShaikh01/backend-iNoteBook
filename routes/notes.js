import express from "express";
import { check, validationResult } from "express-validator";
import fetchUser from "../middlewares/fetchUser.js";
import { Notes } from "../models/note.models.js";


const router = express.Router();


// route 1: fetchAllNotes : GET request : authentication required : "/auth/fetchAllNotes"

router.get("/fetchAllNotes", fetchUser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.userId })
        res.json({success:true,notes})

    } catch (error) {
        res.status(500).json({ success:false ,message: "Internal server error", details: error.message });
    }
})


// route 2: addNotes : POST request :  "/auth/addNote"

router.post("/addNote", fetchUser, [
    check("title", "Please enter a title of atleast 3 characters").isLength({ min: 3 }),
    check("description", "Please enter a description of atleast 7 characters").isLength({ min: 7 }),
], async (req, res) => {

    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success:false, errors: errors.array() });
        }
        const { title, description, tag } = req.body;
        const newNote = new Notes({
            title, description, tag, user: req.user.userId
        })
        const noteAdded = await newNote.save();

        res.json({success:true,noteAdded});

    } catch (error) {
        res.status(500).json({ success:false, message: "Internal server error", details: error.message });
    }



})

/// route:3 :update the note : PUT request : "/notes/update/:id"

router.put("/updateNote/:id", fetchUser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        //create new note object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // find the note to updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).json({success:false,message :"Not found"}) }  // note is not found

        if (note.user.toString() !== req.user.userId) { return res.status(401).json({success:false,message :"Not Allowed"}) }// unauthorized user

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({success:true, note})

    } catch (error) {
        res.status(500).json({success:false, error: "Internal server error", details: error.message });
    }
})


/// route 4 : delete note : DELETE request : "/notes/deleteNote"

router.delete("/deleteNote/:id", fetchUser, async (req, res) => {

    try {
      

        // find the note to deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).json({success:false,message :"Not found"}) }  // note is not found

        if (note.user.toString() !== req.user.userId) { return res.status(401).json({success:false,message :"Not Allowed"}) }// unauthorized user

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({success:true,message:"Note has been deleted successfully"})

    } catch (error) {
        res.status(500).json({ success:false, message: "Internal server error", details: error.message });
    }
})



export default router;

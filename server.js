//dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const app = express();

//handling data
app.use(express.urlencoded({ extended: true })); //not sure if needed
app.use(express.json());

//normally section for data, but storing that in db.json instead

//setting up routing
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(path.join(__dirname, "db.json"));
});

//post
app.post("/api/notes", function(req, res) {
    var newNote = req.body;

    newNote.routeName=newNote.title.replace(/\s+/g, "").toLowerCase();

    console.log(newNote);

    //save data to db.json
    fs.appendFile("db.json", newNote, function(err) {
        if(err) {
            throw err;
        }
        console.log("Saved");
    });

    res.json(newNote);
});

app.delete("/api/tables/:id", function(req, res) {
    savedspace.splice(req.params.id, 1); //change savedspace to db.json file
    res.json(savedspace);
});

app.listen(PORT, function() {
    console.log("App now listening on http://localhost:" + PORT);
});
//dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const app = express();

//handling data
app.use(express.urlencoded({ extended: true })); //not sure if needed
app.use(express.json());

app.use(express.static("public"));

//normally section for data, but storing that in db.json instead

//setting up routing
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile("db.json", "utf8", function(err, data) {
        if(err) {
            throw err;
        }
        return res.json(JSON.parse(data));
    });
});

//post
app.post("/api/notes", function(req, res) {
    var newNote = req.body;

    newNote.routeName = newNote.title.replace(/\s+/g, "").toLowerCase();

    console.log(JSON.stringify(newNote, null, 2));

    fs.readFile("db.json", "utf8", function(err, data) { //reading db.json to see what is already saved
        if(err) {
            throw err;
        }
        else {
            obj = JSON.parse(data);
            obj.push(newNote);
            json = JSON.stringify(obj, null, 2);
        }

        fs.writeFile("db.json", json, function(err) {//appending data to db.json
            if(err) {
                throw err;
            }
            console.log("Saved");
        });
    });
    res.json(newNote);
});

app.get("/api/notes/:id", function(req, res) {
    var note = req.params.id;
  
    console.log(note);

    fs.readFile("db.json", "utf8", function(err, data) {
        if(err) {
            throw err;
        }
        const history = JSON.parse(data);

        for (var x = 0; x < history.length; x++) {
            if (note === history[x].routeName) {
                return res.json(history[x]);
            }
        }

        return res.json(false);
    });
});

app.delete("/api/notes/:id", function(req, res) {
    savedspace.splice(req.params.id, 1); //change savedspace to db.json file
    res.json(savedspace);
});

app.listen(PORT, function() {
    console.log("App now listening on http://localhost:" + PORT);
});
//dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const app = express();

//handling data formats
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//extension in order to use external js/css
app.use(express.static("public"));

//normally this section can be for data, but storing that in db.json instead

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

//post
app.post("/api/notes", function(req, res) {
        var newNote = req.body;
        fs.readFile("db.json", "utf8", function(err, data) {//reading db.json to see what is already saved
            if(err) {
                throw err;
            }
            else {
                let obj = JSON.parse(data);
                let length = obj.length-1; //grabs the last object in the array
                if(obj.length>0) { //sets the id based on the last object
                    newNote.routeName = obj[length].routeName+1; //using numbers instead of title, if multiple of the same title exist not everyone is deleted
                }
                else {
                    newNote.routeName = 0;
                }
                console.log(JSON.stringify(newNote, null, 2));
                obj.push(newNote);
                json = JSON.stringify(obj, null, 2);
            }
            write(json);
        });
    res.json(newNote);
});

//delete
app.delete("/api/notes/:id", function(req, res) {
    console.log("Deleting note: " + req.params.id);
    fs.readFile("db.json", "utf8", function(err, data) { //reading db.json to see what is already saved
        if(err) {
            throw err;
        }
        else {
            obj = JSON.parse(data);
            for (var x = 0; x < obj.length; x++) {
                if (req.params.id == obj[x].routeName) { //changed to == as id ="0" and routeName = 0
                    obj.splice(x, 1);
                }
            }
            edit = JSON.stringify(obj, null, 2);
        }
        write(edit);

        res.json(JSON.parse(edit));
    });
});

//start server/listening on PORT
app.listen(PORT, function() {
    console.log("App now listening on http://localhost:" + PORT);
});

//additional functions area
const write = function(info) {
    fs.writeFile("db.json", info, function(err) {//appending data to db.json
        if(err) {
            throw err;
        }
        console.log("File saved");
    });
}
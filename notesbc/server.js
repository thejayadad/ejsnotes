require("dotenv").config();
const express = require("express")

const expressLayouts = require("express-ejs-layouts");
const Note = require("./models/notes");
const app = express();
const mongoose = require("mongoose");
const port = 3001 || process.env.PORT;
const methodOverride = require("method-override");
const uri = process.env.ATLAS_URI;


mongoose.set('strictQuery', true);

mongoose.connect(uri, {useNewUrlParser: true});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongdb Connected")
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.use(expressLayouts);
app.use(methodOverride("_method"));


app.set("layout", "./layouts/main");
app.set("view engine", "ejs");


//DISPLAYING NOTES

app.get("", async(req, res) => {
    const notes = await Note.find({});
    res.render("home", {notes})
})

//CREATE ROUTE
app.get("/create", function (req, res) {
    res.render("create")
})

app.post("/notes", async(req, res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    res.redirect("/");
})

//DETAIL ROUTE
app.get("/detail/:id", async(req, res)=>{
    const {id} = req.params;
    const notes = await Note.findById(id)
    res.render("detail", {notes})
})

//EDIT ROUTE
app.get("/note/:id/edit", async(req, res) => {
    const {id} = req.params;
    const note = await Note.findById(id);

    res.render("edit", {note})
})

app.put("/note/:id", async(req, res) => {
    const {id} = req.params;
    const note = await Note.findByIdAndUpdate(id, req.body, {runValidators: true})
    res.redirect("/")
})

//DELETE ROUTE
app.delete("/note/:id", async(req, res) => {
    const {id} = req.params;
    const deleteNote = await Note.findByIdAndDelete(id)
    res.redirect("/")
})



app.listen(port, () => {
    console.log(`Port going on ${port}`)
})
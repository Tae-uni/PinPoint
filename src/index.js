const express = require("express"); // import Express.js module
const app = express(); // creates an instance of the Express app.
const path = require("path"); // import path module.
const hbs = require("hbs"); // import Handelbars template engine. use of templates for rendering views.
const collection = require("./mongodb"); //
const signupController = require("./controllers/signupController");
const loginController = require("./controllers/loginController");

const templatePath = path.join(__dirname, '../templates');

// Middleware settings
app.use(express.json());
app.set("view engine", "hbs"); // ejs
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false })); // mongoDB

// route settings
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", signupController(collection));
app.post("/login", loginController(collection));

// it must be same with login.hbs form action's value.
app.listen(3000, () => {
    console.log("3000 port connected");
})
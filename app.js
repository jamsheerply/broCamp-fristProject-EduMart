const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require('dotenv').config();

try {
    mongoose.connect(process.env.DB).then(()=>console.log("Connected to MongoDB"))
} catch (error) {
    console.error("Mongoose connection error:", error);
}
const app = express();

// Initialization
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));


// ..........set port, listen for requests........
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port  http://127.0.0.1:${PORT}`);
});


//for user routes
const userRoute=require("./routes/userRoute")
app.use("/user",userRoute)

//for admin routes
const adminRoute=require("./routes/adminRoute")
app.use("/admin",adminRoute)

//........landingPage.....................
app.set('view engine', 'ejs');
app.use(express.static("public"));

const userController = require("./controller/userController");
app.get("/", userController.loadLanding)


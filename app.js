const express = require("express");
const mongoose = require("mongoose");

try {
    mongoose.connect("mongodb://127.0.0.1:27017/EduMart");
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Mongoose connection error:", error);
}
const app = express();



// ..........set port, listen for requests........
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port  http://127.0.0.1:${PORT}`);
});


//for user routes
const userRoute=require("./routers/userRouter")
app.use("/user",userRoute)


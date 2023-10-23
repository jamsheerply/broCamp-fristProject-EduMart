//.................express......................................
const express = require("express");
const app = express();
app.listen(8000, () => {
    console.log("Server is running at http://127.0.0.1:8000");
});

// ................view engine...................................
app.set('view engine', 'ejs')

// ....................static file...............................
app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render('user/singleProduct')
    // res.send("hello")
})
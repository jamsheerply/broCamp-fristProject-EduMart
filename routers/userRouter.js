const express = require("express")
const userRoute = express()
const userController = require("../controller/userController")

userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

// const path = require("path")
// const multer = require("multer")
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, "../public/userImage"))
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + "-" + file.originalname
//         cb(null, name)
//     }
// })
// const upload=multer({storage:storage})

userRoute.set('view engine', 'ejs');
userRoute.use(express.static("public"));

userRoute.get("/register", userController.loadRegister)
userRoute.post("/register",userController.insertUser)
userRoute.get("/otp",userController.loadOtp)
userRoute.post("/otp",userController.verifyOtp)
userRoute.get("/home",userController.loadHome)
// userRoute.post("/register",upload.single("profileImage"),userController.insertUser)

// 



module.exports = userRoute

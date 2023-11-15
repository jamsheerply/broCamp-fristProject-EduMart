const express = require("express")
const userRoute = express()
const userController = require("../controller/userController")
const cartconstroller=require("../controller/cartController")
const userAuth=require("../midddleware/UserAuth")
const adminAuth=require("../midddleware/adminAuth")

//.............middleWare........................
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

//....................view engine......................
userRoute.set('view engine', 'ejs');
userRoute.use(express.static("public"));

//...................userSide..........................................
userRoute.get("/register",userAuth.userExist,userController.loadRegister)
userRoute.post("/register",userController.insertUser)
userRoute.get("/otp",userAuth.userExist,userController.loadOtp)
userRoute.post("/otp",userController.verifyOtp)
userRoute.get("/resend-otp",userController.resendOtp)
userRoute.get("/home",userAuth.verifyUser,userController.loadHome)
userRoute.get("/login", userAuth.userExist,adminAuth.adminExist,(req, res) => {
    res.setHeader("Cache-Control", "no-store");
    userController.loadLogin(req, res);
});
userRoute.post("/login",userController.verifyLogin)
userRoute.get("/logout",userController.userLogout)

//...................productList.............................
userRoute.get("/product-list",userAuth.verifyUser,userController.loadProductList)

//...................singleProudct...........................
userRoute.get("/product-detail",userAuth.verifyUser,userController.loadProductDetail)

//...................shopping-cart...........................
userRoute.get("/shopping-cart",userAuth.verifyUser,cartconstroller.loadShopingCart)
userRoute.post("/shopping-cart",userAuth.verifyUser,cartconstroller.insertTOShopingCart)

//.......................check-out............................
userRoute.get("/check-out",userController.loadCheckOut)


// userRoute.post("/admin/insert",userController.adminInsert)

module.exports = userRoute

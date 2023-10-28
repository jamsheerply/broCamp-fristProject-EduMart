const express=require("express")
const adminRoute=express()
const adminController=require("../controller/adminController")

//middleWare
adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

//view engine
adminRoute.set("view engine","ejs")
adminRoute.use(express.static("public"))

adminRoute.get("/category",adminController.loadCategory)
adminRoute.post("/category",adminController.insertCategory)

module.exports=adminRoute
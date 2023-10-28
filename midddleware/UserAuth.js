const isLogin = async (req, res, next) => {
    try {
        if (req.session.id && req.session.role === "user") {
            next()
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error.message+ "isLogin")
    }
    
}
const isLogOut = async (req, res, next) => {
    try {
        if (req.session.id && req.session.role === "user") {
            res.redirect("/user/home")
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message+ "isLogOut")
    }
   
}
module.exports={
isLogin,
isLogOut
}

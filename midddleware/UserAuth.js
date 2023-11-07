const verifyUser= async (req, res, next) => {
    try {
        if (req.session.userLogged) {
            next()
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error.message+ "isLogin")
    }
    
}
const userExist= async (req, res, next) => {
    try {
        if (req.session.userLogged) {
            res.redirect("/user/home")
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message+ "isLogOut")
    }
   
}
module.exports={
    verifyUser,
    userExist
}

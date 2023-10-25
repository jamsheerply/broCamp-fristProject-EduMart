const userModel = require("../model/userModel");
const otpVerification = require("../model/otpVerification")

const bcrypt = require("bcrypt")
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message + " bcrypt")
    }
}

const nodemailer = require("nodemailer")
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'safatedumartpayyoli@gmail.com',   //need to setup this in your google account
                pass: 'uzky uzdu vswi pupe',
            },
        });
        const mailOptions = {
            from: 'safatedumartpayyoli@gmail.com',
            to: email,
            subject: "for verification mail for safat edumart payyoli",
            html: "<h2>hi " + name + " </h2>" + "<h2>OTP for account verification is </h2>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        }
        await new otpVerification({
            email: email,
            otp: otp,
        }).save();
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("email has been sent", info.response)
            }
        })

    } catch (error) {
        console.log(error.message + " sendVerifyMail")
    }
}

const loadRegister = async (req, res) => {
    try {
        res.render("user/register");
    } catch (error) {
        console.log(error.message + " loadUser");
    }
};
const insertUser = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password)
        const user = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            profileImage: req.file.filename,
            password: spassword
        })
        if (userData) {
            console.log(userData)
            res.json({status:true})
            let exist=await userModel.findOne({email:email})
            if(exist){
                res.json({err:"User ALready exist"})
            }else{
                const userData = await user.save()
            }
            console.log(userData)
        } else {
            console.log("data inserted in user failed")
        }
    } catch (error) {
        console.log(error.message + " insertUser")
    }
}

module.exports = {
    loadRegister,
    insertUser
};

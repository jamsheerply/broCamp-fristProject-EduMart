const userModel = require("../model/userModel");
const otpVerification = require("../model/otpVerification")
const jwt=require("jsonwebtoken")
require('dotenv').config();


//............passwordHashing.......................
const bcrypt = require("bcrypt")
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message + " bcrypt")
    }
}

//.................nodeMailer......................
const nodemailer = require("nodemailer");
const { name } = require("ejs");
const sendVerifyMail = async (name, email) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_EMAIL,   //need to setup this in your google account
                pass: process.env.SMTP_PASS,
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

// ...............loadRegister......................
const loadRegister = async (req, res) => {
    try {
        res.render("user/register");
    } catch (error) {
        console.log(error.message + " loadUser");
    }
};

//.................insertuser..........................
const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        console.log(req.body.lastName + "console")
        const userData = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: spassword
        });

        if (userData) {
            console.log(userData);


            // Use req.body.email here instead of undefined 'email'
            let exist = await userModel.findOne({ email: req.body.email });

            if (exist) {
                return res.json({ err: "User Already Exists" });
            } else {
                sendVerifyMail(req.body.firstName, req.body.email)
                req.session.userData = userData
                // await userData.save();
                return res.json({ status: true });
            }
            console.log(userData);
        } else {
            console.log("Data insertion in user failed");
        }
    } catch (error) {
        console.log(error.message + " insertUser");
    }
}

//..................loadOtp..........................
const loadOtp = async (req, res) => {
    try {
        res.render("user/otp")
    } catch (error) {
        console.log(error.message + " loadOTp")
    }
}

// ...............verifyOtp...................
const verifyOtp = async (req, res) => {
    try {
        const digitOne = req.body.digitOne;
        const digitTwo = req.body.digitTwo;
        const digitThree = req.body.digitThree;
        const digitFour = req.body.digitFour;
        const strOtp = digitOne + digitTwo + digitThree + digitFour;
        console.log(strOtp + "strOtp");
        const email = req.session.userData.email;
        let storedOtp = await otpVerification.findOne({ email: email });
        const { otp, emailstored } = storedOtp;
        console.log(otp + " stored");
        if (strOtp == otp) {
            const userData = req.session.userData;
            console.log(userData);

            // Now, save the user data to the database
            const saveData = new userModel(userData);  // Create an instance of the userModel

            await saveData.save(); // Save the user data to the database
            console.log(saveData._id)

            res.render("/user/home");
            const token=jwt.sign({id:saveData._id},process.env.SECRET_STR,{
                expiresIn:process.env.LOGIN_EXPIRES
            })
        } else {
            console.log("otp error");
        }
    } catch (error) {
        console.log(error.message);
    }
}

// .......................loadHome............................
const loadHome = async (req, res) => {
    res.render("user/landing")
}
module.exports = {
    loadRegister,
    insertUser,
    loadOtp,
    verifyOtp,
    loadHome
};

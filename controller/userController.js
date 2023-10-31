const userModel = require("../model/userModel");
const otpVerification = require("../model/otpVerification")
const adminModel = require("../model/adminModel")
const jwt = require("jsonwebtoken")
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

//............loadLanding..........................
const loadLanding = async (req, res) => {
    if (req.session.id && req.session.role == "user") {
        res.redirect("/user/home")
    } else {
        res.render("user/landing")
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
        const userData = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: spassword
        });

        if (userData) {
            // Use req.body.email here instead of undefined 'email'
            let exist = await userModel.findOne({ email: req.body.email });

            if (exist) {
                return res.json({ err: "User Already Exists" });
            } else {
                sendVerifyMail(req.body.firstName, req.body.email)
                req.session.userData = userData
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

// ...............verifyOtp............................
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
            const saveData = new userModel(userData);
            await saveData.save();
            res.redirect("/user/home");
        } else {
            res.render("user/otp", { message: "invalid otp" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

// .......................loadHome....................
const loadHome = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("user/home")
    } catch (error) {
        console.log(error.message + "loadHome")
    }
}

//.......................loadLogin...................
const loadLogin = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("user/login")
    } catch (error) {
        console.log(error.message + "loadLogin")
    }
}

//.................verifyLogin......................
const verifyLogin = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        const { email, password } = req.body
        const userData = await userModel.findOne({ email: email })
        if (userData) {
            const passwordCompare = await bcrypt.compare(password, userData.password)
            if (passwordCompare) {
                req.session.id = userData._id
                req.session.role = userData.role
                res.redirect("/user/home")
            } else {
                res.render("user/login", { message: "Email and password is incorrect" })
            }
        } else {
            res.render("user/login", { message: "User not found" })
        }
    } catch (error) {
        console.log(error.message + " verifyLogin")
    }
}

//................adminInsert.......................
const adminInsert = async (req, res) => {
    try {
        const adminData = new adminModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        adminData.save()
        if (adminData) {
            res.send("inserted")
        }
    } catch (error) {
        console.log(error.message + " adiminInsert")
    }
}

//..............logOut.......................
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message + " userLogout")
    }
}

module.exports = {
    loadLanding,
    loadRegister,
    insertUser,
    loadOtp,
    verifyOtp,
    loadHome,
    loadLogin,
    verifyLogin,
    adminInsert,
    userLogout
};

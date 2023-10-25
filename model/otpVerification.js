const mongoose = require("mongoose");

const otpVerification = new mongoose.Schema({
    otp: {
        type: Number,
    },
    email: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1m', // Expiry time in minutes
    },
});

otpVerification.index({ createdAt: 1 }, { expireAfterSeconds: 0 }); // Create the TTL index



module.exports = mongoose.model("otp", otpVerification);

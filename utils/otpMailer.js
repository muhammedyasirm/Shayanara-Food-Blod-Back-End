const userOTPData = require("../models/OTPModel");
const nodemailer = require("nodemailer");
const { hashOTP, compareOtp } = require("./helpers");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "castleicecreams@gmail.com",
        pass: "wnybnjcalurvjwrh"
    }
});

const sendOTPVerificationMail = async ({_id, email}, req,res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: "castleicecreams@gmail.com",
            to: email,
            subject: "Verify your Email",
            html: `<p>Enter <b>${otp}</b> to verify your account</p><p>This code <b>Expires in 2 Minutes</b>.</p>`,
        };

        await userOTPData.deleteMany({ userId:_id});
        const hashedOTP = hashOTP(otp);
        const newOTPVerification = new userOTPData({
            userId: _id,
            userEmail: email,
            otp: hashedOTP,
            expiresAt: Date.now() + 120000
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: "ok"});
    } catch (err) {
        res.status(401)
    }
};

module.exports = { sendOTPVerificationMail };
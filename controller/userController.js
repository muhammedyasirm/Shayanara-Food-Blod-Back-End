const userData = require('../models/userModel');
const userOTPData = require('../models/OTPModel');
const { sendOTPVerificationMail } = require("../utils/otpMailer");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const {
    hashPassword,
    comparePassword,
    hashOTP,
    compareOTP
} = require("../utils/helpers");
const { response } = require('../routes/userRoutes');

exports.homePage = async (req, res) => {
    try {
        res.status(200).send("home page");
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
};

exports.register = async (req, res) => {
    try {
        const { userName, fullName, email, phone, password } = req.body;
        const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!userName || !fullName || !email || !phone || !password) {
            return res.json({ status: "1err" });
        } else if (userName < 6) {
            return res.json({ status: "2err" });
        } else if (!email.match(regx)) {
            return res.json({ status: "3err" });
        } else if (phone.length != 10 || isNaN(phone)) {
            return res.json({ status: "4err" });
        } else if (password.length < 6 || password.length > 15) {
            return res.json({ status: "5err" });
        }
        const userna = await userData.findOne({ userName })
        if (userna) {
            if (userna.isVerified == false) {
                await userData.findOneAndDelete({ userName });
            }
        }

        const userEmail = await userData.findOne({ email });
        if (userEmail) {
            if (userEmail.isVerified == false) {
                await userData.findOneAndDelete({ email });
            }
        }

        const username = await userData.findOne({ userName });
        if (!username) {
            const userEmail = await userData.findOne({ email });
            if (!userEmail) {
                const hashedPassword = hashPassword(password);
                const user = await userData.create({
                    userName,
                    fullName,
                    email,
                    phone,
                    password: hashedPassword
                });
                user.save().then((data) => {
                    sendOTPVerificationMail(data, req, res)
                });
                res.status(200).json({ status: "Success" })
            } else {
                res.status(200).json({ status: "emailExist" });
            }
        } else {
            res.status(200).json({ status: "userExist" })
        }
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
        console.log(err);
    }
};

exports.otpVerify = async (req, res) => {
    try {
        let { otp, email } = req.body;
        if (req.body.input) {
            email = req.body.input;
        }

        const userOtp = await userOTPData.findOne({ userEmail: email });

        if (Date.now() < userOtp.expiresAt) {
            const isValid = compareOTP(otp, userOtp.otp);
            if (isValid) {
                await userData.findOneAndUpdate({ email }, { isVerified: true });
                await userOTPData.findOneAndDelete({ userEmail: email });
                const user = await userData.findOne({ email });
                res.status(200).json({ user });
            } else {
                res.status(200).json({ status: "invalid" });
            }
        } else {
            await userOTPData.deleteMany({ userEmail: email });
            await userData.findOneAndDelete({ email });
            res.status(200).json({ status: "expired" });
        }
    } catch (err) {
        res.status(401).json({ err: "catchErr" });
    }
};

exports.login = (req, res) => {
    try {
        const { name, password } = req.body;
        userData.findOne({ $or: [{ userName: name }, { email: name }] }).then((user) => {
            if (user) {
                if (user.isBlocked) {
                    res.send({ err: "User is blocked" })
                } else {
                    if (user.isVerified) {
                        const isValid = comparePassword(password, user.password)
                        if (isValid) {
                            let payload = {
                                id: user._id,
                                email: user.email
                            };
                            jwt.sign(
                                payload,
                                process.env.JWT_SECRET_KEY,
                                {
                                    expiresIn: 86400
                                },
                                (err, token) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(token)
                                        res.send({ logged: true, user, token: `Bearer ${token}` });
                                    }
                                }
                            )
                        } else {
                            res.send({ err: "Invalid User Details" })
                        }
                    } else {
                        res.send({ err: "User is not verified" })
                    }
                }
            } else {
                res.send({ err: "Invalid User" });
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userData.findOne({ email });
        if (user) {
            const userId = user._id;
            sendOTPVerificationMail({ _id: userId, email }, req, res);
        } else {
            res.status(200).json({ status: "notFound" });
        }
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = hashPassword(password);
        await userData.findOneAndUpdate({ email }, { password: hashedPassword });
        res.status(200).send({ status: "ok" });
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.addBio = async (req, res) => {
    try {
        const { bio } = req.body;
        const id = req.params;
        console.log("idddd")
        console.log(id.id);
        if (!bio) {
            res.send({ err: "Value required" })
        } else {
            await userData.updateOne({ _id: id.id }, { bio: bio });
            const user = await userData.findOne({ _id: id.id });
            res.send({ bioAdd: true, user });
        }
    } catch (err) {
        console.log(err)
    }
}

exports.editProfile = async (req, res) => {
    try {
        const { fullName, phone, bio } = req.body;
        const id = req.params.id;
        console.log(req.body);
        console.log("editile id",id);
        await userData.updateOne({ _id: id }, {
            $set: {
                fullName,
                phone,
                bio
            }
        })
        const user = await userData.findOne({ _id: id });
        res.send({ proEdit: true, user });
    } catch (err) {
        console.log("oomby", err);
    }
}

exports.profileImage = async (req, res) => {
    const profileImage = req.file.path;
    const id = req.id;
    console.log(profileImage);
    await userData.findByIdAndUpdate({ _id: id }, {
        $set: {
            profilePic: profileImage
        }
    });

    const user = await userData.findOne({ _id: id });

    res.send({ proImage: true, user});




}
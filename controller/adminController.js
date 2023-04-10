const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/userModel");
const locationData = require("../models/locationModel");

exports.adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Id and password")
        if (email === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
            let payload = {
                admin: email
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
                        res.send({ logged: true, token: `Bearer ${token}` });
                    }
                }
            )
        } else {
            res.send({ err: "Invalid User" });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getUser = (req, res) => {
    try {
        User.find().then((userdata) => {
            res.send({ userdata });
        });
    } catch (err) {
        console.log(err);
    }
}

exports.blockUser = (req, res) => {
    try {
        const id = req.params.id;
        let value;
        User.findById(id).then((data) => {
            if (data.isBlocked === true) {
                value = false;
            } else {
                value = true;
            }
            User.findByIdAndUpdate(id, { isBlocked: value }).then((user) => {
                if (user) {
                    res.send({ success: true });
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}

exports.addLocation = async (req, res) => {
    try {
        const { name } = req.body;
        const exist = await locationData.findOne({ name });
        if (exist) {
            return res.status(200).json({ status: "existErr" });
        }
        const location = new locationData({
            name,
        });
        await location.save();
        res.status(200).json({ status: true });
    } catch (err) {
        console.log("error", err)
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.getLocation = (req, res) => {
    try {
        locationData.find().then((location) => {
            res.send({ location });
        })
    } catch (error) {
        console.log(error);
    }
}

exports.deleteLocation = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Location delete id", id);
        await locationData.findByIdAndDelete(id);
        res.json({ message: 'Location deleted' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
}
const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/userModel");
const locationData = require("../models/locationModel");
const reportData = require("../models/reportModel");
const postData = require("../models/postModel");
const mongoose = require('mongoose');

exports.adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
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

exports.getUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const total = await User.countDocuments();
        const skip = (page - 1) * size;

        User.find().skip(skip).limit(size).then((userdata) => {
            res.send({ userdata, total, page, size });
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
        await locationData.findByIdAndDelete(id);
        res.json({ message: 'Location deleted' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getReports = async (req, res) => {
    try {
        const data = await reportData
            .find({})
            .sort({ createdAt: -1 })
        res.status(200).json({ data });
    } catch (error) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.reportSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = new mongoose.Types.ObjectId(id);
        const post = await postData.aggregate([
            {
                $match: {
                    _id: postId
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "details"
                }
            }
        ]);
        res.status(200).json({ post });
    } catch (error) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.deleteReportedPost = async (req, res) => {
    try {
        const id = req.params.id;
        const postId = new mongoose.Types.ObjectId(id);
        const rid = req.params.rid;
        // const reportId = new mongoose.Types.ObjectId(rid);

        postData.findByIdAndDelete(postId).then(() => {
            reportData.deleteOne({_id:rid}).then(() => {
                res.json({ message: 'Post and Report deleted' });
            })})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const postData = require("../models/postModel");
const userData = require("../models/userModel");
const locationData = require("../models/locationModel");
const likeData = require("../models/likeModel");
const commentData = require("../models/commentModel");
const reportData = require("../models/reportModel");
const mongoose = require('mongoose');

exports.addPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const { foodName, desc, rating, url1, url2, resName, contact, address } = req.body;
        if (!foodName || !desc || !rating || !resName) {
            res.json({ status: "emptyErr" });
        }
        const post = new postData({
            userId,
            foodName,
            desc,
            rating,
            resName,
            contact,
            address,
            images: {
                url: url1,
            },
            resImage: {
                url: url2,
            },
        });
        await post.save();
        res.status(200).send(post);
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.getPosts = async (req, res) => {
    try {
        const postDatas = await postData.aggregate([
            {
                $sort: {
                    updatedAt: -1,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            }
        ])
        res.send({ postDatas });
    } catch (error) {

    }
}

exports.getLocationPost = (req, res) => {
    try {
        locationData.find().then((location) => {
            res.send({ location });
        })
    } catch (error) {
        console.log(error);
    }
}

exports.singlePost = async (req, res) => {
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
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
};

exports.likePost = async (req, res) => {
    try {
        const user = req.body.user;
        const userId = new mongoose.Types.ObjectId(user);
        console.log("Like cheyyumbo userId", userId);
        const post = req.params.id;
        const postId = new mongoose.Types.ObjectId(post);

        const postLike = await likeData.findOne({
            $and: [{ userId: { $eq: userId } }, { postId: { $eq: postId } }],
        })

        if (postLike) {
            await likeData.findOneAndDelete({
                $and: [{ userId: { $eq: userId } }, { postId: { $eq: postId } }]
            });
            res.status(200).json({ status: false });
        } else {
            const likes = new likeData({
                userId,
                postId,
                like: true,
            });
            await likes.save();
            res.status(200).json({ status: true });
        }
    } catch (error) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.getLikeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = new mongoose.Types.ObjectId(id);
        const user = req.headers["x-custom-header"];
        const userId = new mongoose.Types.ObjectId(user);

        const likes = await likeData.find({
            userId,
            postId,
            like: true
        });

        if (likes) {
            res.status(200).json({ likes });
        }
    } catch (err) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.commentPost = async (req, res) => {
    try {
        const { user, comment } = req.body;
        console.log("Comment user", user);
        console.log("Comment ", comment);

        const userId = new mongoose.Types.ObjectId(user);
        console.log("UserId kitty poolum", userId);
        const post = req.params.id;
        console.log("params id", post)
        const postId = new mongoose.Types.ObjectId(post);
        console.log("postId kitty poolum", postId);
        const isExist = await commentData.findOne({
            $and: [{ userId: { $eq: userId } }, { postId: { $eq: postId } }],
        });


        if (isExist) {
            const addToExist = await commentData.findOneAndUpdate(
                {
                    $and: [{ userId: { $eq: userId } }, { postId: { $eq: postId } }]
                },
                { $push: { comment: comment } }
            );
            res.status(200).send(addToExist);
        } else {
            const comments = new commentData({
                userId,
                postId,
                comment,
            });
            await comments.save();
            res.status(200).send(comments);
        }
    } catch (error) {
        res.status(401).json({ err: 'catchErr' })
    }
}

exports.postComments = async (req, res) => {
    try {
        const id = req.params.id;
        const postId = new mongoose.Types.ObjectId(id);
        const data = await commentData.aggregate([
            {
                $match: {
                    postId,
                }
            },
            {
                $sort: {
                    createdAt: -1
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
        ])

        res.status(200).json({ data });

    } catch (err) {
        res.status(401).json({ err: 'catchErr' });
    }
}

exports.reportPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { postedUser, reportedUser, report } = req.body;

        if (!postId || !postedUser || !reportedUser) {
            return res.json({ status: "wrongErr" });
        }

        if (!report) {
            return res.json({ status: "inputErr" });
        }
        const data = new reportData({
            postId,
            userId: postedUser,
            reportedUser,
            report,
        });
        await data.save();
        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(401).json({err:'catchErr'})
    }
}


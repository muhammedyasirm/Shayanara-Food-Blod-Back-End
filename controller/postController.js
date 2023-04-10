const postData = require("../models/postModel");
const userData = require("../models/userModel");
const locationData = require("../models/locationModel");

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
    console.log("Try'nte mele");
    try {
        console.log("Vanthitta");
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

        console.log(postDatas);
        res.send({postDatas});
    } catch (error) {

    }
    // const posts = await postData.find().sort({ updatedAt: -1 });;
    // res.send({posts});
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
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

exports.accessChat = async( req, res ) => {
    const { userId } = req.body;

    const id = req.id;

    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users","-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "fullName profilePic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users",
                "-password"
            );

            res.status(200).send(FullChat);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

exports.fetchChats = async( req, res ) => {
    const id = req.id;
    try {
        Chat.find({ users: { $elemMatch: { $eq: id } } })
        .populate("users", "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1}) 
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "fullName profilePic email"
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

exports.createGroupChat = async (req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds"});
    }
    const id = req.id;
    let users = JSON.parse(req.body.users);

    if(users.length < 2) {
        return res.status(400).send({ message: "More tha 2 users are required to form a group chat"}); 
    }

    users.push(id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: id
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users","-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

exports.renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
}

exports.addToGroup = async(req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId, 
        { 
          $push: { users: userId},
        },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
}

exports.removeFromGroup = async(req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId, 
        { 
          $pull: { users: userId},
        },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
}


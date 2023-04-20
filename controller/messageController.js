const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    const id = req.id;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    let newMessage = {
        sender: id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender","fullName profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select:'fullName profilePic email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

exports.allMessages = async ( req, res ) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId})
        .populate("sender","fullName profilePic email")
        .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message); 
    }
}
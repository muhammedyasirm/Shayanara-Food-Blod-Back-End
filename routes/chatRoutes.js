const express = require('express');
const router = express();
const { verify } = require("../middlewares/userVerification");

const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
} = require('../controller/chatController');

router.post('/chat',verify,accessChat);
router.get('/chat',verify,fetchChats);
router.post('/group',verify,createGroupChat);
router.put('/rename',verify,renameGroup);
router.put('/groupRemove',verify,removeFromGroup);
router.put('/groupAdd',verify,addToGroup);

module.exports = router;
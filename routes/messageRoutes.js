const express = require('express');
const router = express();
const { verify } = require("../middlewares/userVerification");

const {
    sendMessage,
    allMessages
} = require('../controller/messageController');

router.post('/',verify,sendMessage);
router.get('/:chatId',verify,allMessages);


module.exports = router;
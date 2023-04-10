const express = require('express');
const router = express();
const { verify } = require('../middlewares/userVerification');

const {
    addPost,
    getPosts,
    getLocationPost
} = require('../controller/postController');

router.post("/users/addPost/:id", verify, addPost);
router.get('/users/getPosts',verify,getPosts);
router.get('/post/getLocation',verify,getLocationPost);

module.exports = router;



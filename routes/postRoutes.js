const express = require('express');
const router = express();
const { verify } = require('../middlewares/userVerification');

const {
    addPost,
    getPosts,
    getLocationPost,
    singlePost,
    getLikeDetails,
    likePost,
    commentPost,
    postComments,
    reportPost,
    deletePost
} = require('../controller/postController');

router.post("/users/addPost/:id", verify, addPost);
router.get('/users/getPosts',getPosts);
router.get('/post/getLocation',getLocationPost);
router.get('/users/getSingleView/:id',verify,singlePost);
router.get("/user/getLikeDetails/:id", getLikeDetails);
router.post("/user/likePost/:id", likePost);
router.post("/user/commentPost/:id", commentPost);
router.get("/user/postComments/:id",postComments);
router.post('/user/reportPost/:id', reportPost);
router.delete('/user/deletePost/:id',deletePost);


module.exports = router;



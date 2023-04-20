const express = require('express');
const router = express();
const uploadImage = require('../middlewares/cloudinary');
const {
    homePage,
    register,
    otpVerify,
    login,
    forgotPassword,
    resetPassword,
    addBio,
    editProfile,
    profileImage,
    followersDetails,
    followUser,
    searchChat
} = require('../controller/userController');
const { verify } = require('../middlewares/userVerification');

router.get("/",homePage);
router.post("/user/register",register);
router.post("/user/otpVerify",otpVerify);
router.post("/user/login",login);
router.post("/user/forgotPassword",forgotPassword);
router.post("/user/restPassword",resetPassword);
router.put("/user/addBio/:id",verify, addBio);
router.put("/user/editProfile/:id",verify,editProfile);
router.post("/user/profileImage",verify,uploadImage,profileImage);
router.get("/user/followersDetails/:id", followersDetails);
router.put("/user/followUser/:id", followUser);
router.get("/user/searchChat",verify,searchChat);

module.exports = router;
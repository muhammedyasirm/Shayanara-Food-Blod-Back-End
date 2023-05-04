const express = require('express');
const router = express();
const { verify } = require('../middlewares/adminVerify');
const uploadImage = require('../middlewares/cloudinary');
const {
    adminLogin,
    getUser,
    blockUser,
    addLocation,
    getLocation,
    deleteLocation,
    getReports,
    reportSingle,
    deleteReportedPost,
    deleteReport,
    postRecipe,
    getRecipe,
    addBanner,
    getBanner,
    deleteBanner,
    deleteRecipe
} = require('../controller/adminController');

router.post("/login",adminLogin);
router.get("/getusers", getUser);
router.get('/blockuser/:id', blockUser);
router.post("/addLocation", addLocation);
router.get("/getLocation",getLocation);
router.delete("/deleteLocation/:id",deleteLocation);
router.get("/getReports",getReports);
router.get("/reportSingle/:id",reportSingle);
router.delete("/deleteReportedPost/:id/:rid",deleteReportedPost);
router.delete("/deleteReport/:rid",deleteReport);
router.post("/addRecipe",uploadImage,postRecipe);
router.get("/getRecipe",getRecipe);
router.post("/addBanner",uploadImage,addBanner);
router.get('/getBanner',getBanner);
router.delete('/deleteBanner/:id',deleteBanner);
router.delete('/deleteRecipe/:id',deleteRecipe);




module.exports = router;

const express = require('express');
const router = express();
const { verify } = require('../middlewares/adminVerify');
const {
    adminLogin,
    getUser,
    blockUser,
    addLocation,
    getLocation,
    deleteLocation,
    getReports,
    reportSingle,
    deleteReportedPost
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




module.exports = router;

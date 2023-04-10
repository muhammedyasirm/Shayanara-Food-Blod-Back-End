const express = require('express');
const router = express();
const { verify } = require('../middlewares/adminVerify');
const {
    adminLogin,
    getUser,
    blockUser,
    addLocation,
    getLocation,
    deleteLocation
} = require('../controller/adminController');

router.post("/login",adminLogin);
router.get("/getusers", getUser);
router.get('/blockuser/:id', blockUser);
router.post("/addLocation", addLocation);
router.get("/getLocation",getLocation);
router.delete("/deleteLocation/:id",deleteLocation);




module.exports = router;

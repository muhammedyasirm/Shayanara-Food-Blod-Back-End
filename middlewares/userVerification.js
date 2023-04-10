const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    verify: (req,res,next) => {
        const token = req.headers.authorization
        if(!token) {
            return res.status(400).send({
                token: false,
                message:'No token provided'
            })
        }
        try {
            const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET_KEY);
            if(decoded) {
                User.findOne({_id: decoded.id}).then((user) => {
                    if(user.isBlocked){
                        return res.status(400).send({
                            blocked: true,
                            message:"blocked by admin..."
                        });
                    } else {
                        req.id = decoded.id;
                        next();
                    }
                });
            } else {
                return res.status(400).send({
                    token: false,
                    message: "invalid token"
                });
            }
        } catch (err) {
            return res.status(400).send({
                token: false,
                message: "invalid token"
            });
        }
    }
}
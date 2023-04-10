const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    adminVerify: (req, res, next) => {
        const token = req.headers.authorization
        if (!token) {
            return res.status(400).send({
                token: false,
                message: 'No token provided'
            })
        }
        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
            if (decoded) {
                req.admin = decoded;
                next();
            } else {
                return res.status(400).send({
                    token: false,
                    message: "invalid token"
                });
            }
        } catch (error) {
            return res.status(400).send({
                token: false,
                message: "invalid token"
            });
        }
    }
}
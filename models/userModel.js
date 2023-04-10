const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            require: true
        },
        fullName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            required:true
        },
        phone: {
            type: Number,
            require: true
        },
        password: {
            type: String,
            required:true
            
        },
        isBlocked: {
            type: Boolean,
            default:false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        followers: {
            type: Array,
            default: []
        },
        bio:{
            type: String
        },
        profilePic: {
            type: String
        },
        refreshToken: [String]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);

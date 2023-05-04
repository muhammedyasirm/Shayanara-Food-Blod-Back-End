const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
    {
        bannerName: {
            type: String,
            required: true
        },
        foodName: {
            type: String,
            required: true
        },
        hotelName: {
            type: String,
            required: true
        },
        offer: {
            type: String,
            required: true
        },
        imageFile: {
            url: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Banner",bannerSchema);

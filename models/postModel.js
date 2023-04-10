const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    foodName: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      requried: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: {
      url: String,
    },
    resName: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
    },
    address: {
      type: String,
    },
    resImage: {
      url: String,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Post", postSchema);
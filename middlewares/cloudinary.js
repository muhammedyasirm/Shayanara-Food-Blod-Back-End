const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shayanara",
    allowedFormats: ["jpeg", "png", "jpg","webp"],
  },
});

const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (!["image/png", "image/jpg", "image/jpeg" , "image/webp" ] .includes(file.mimetype)) {
    return cb(new Error("File is not an image"));
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = (req, res, next) => { 

  upload.single("image")(req, res, (err) => {
    if (err) {
       console.log(err); 
      
        return res.send({ err: "Selected file is not an image" });
    }
    return next();   
  });
};
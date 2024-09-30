const multer = require("multer");
const path = require("path");
const cors = require("cors");

const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../imagesUser/images"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileUpload = multer({
  storage: diskstorage,
}).single("image");

module.exports = fileUpload;

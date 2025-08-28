const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "ddnvbetzu",   // ✅ string
  api_key: "418233681299887", // ✅ string
  api_secret: "magG_rHMPyrTVsMtBUcKaCRYjJA" // ✅ string
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "logos",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

module.exports = { cloudinary, storage };

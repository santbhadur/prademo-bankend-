// cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "ddnvbetzu",   // तेरे credentials
  api_key: "418233681299887",
  api_secret: "magG_rHMPyrTVsMtBUcKaCRYjJA",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "logos", // ✅ सारे uploads इसी folder में जाएंगे
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = { cloudinary, storage };

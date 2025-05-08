const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === "lessonVideos") {
      uploadPath = "uploads/videos/";
    } else if (file.fieldname === "banner") {
      uploadPath = "uploads/banners/";
    } else {
      return cb(new Error("Invalid file field"), false);
    }
    createFolderIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter

const fileFilter = (req, file, cb) => {
  if (!file.mimetype) {
    return cb(new Error("File missing MIME type"), false);
  }
  if (
    (file.fieldname === "video" || file.fieldname === "lessonVideos") &&
    file.mimetype.startsWith("video/")
  ) {
    return cb(null, true);
  }
  if (file.fieldname === "banner" && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  return cb(new Error("Unsupported file type"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

// middleware/upload.js
// middleware/upload.js


const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Define file storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     ); // 23/08/2022
//   },
// });
const storage = multer.memoryStorage();

// Specify file format that can be saved
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });

// File Size Formatter
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function handleUpload(file) {
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    if (res && res.secure_url) {
      return res.secure_url; // Return only the secure URL
    } else {
      throw new Error("Upload failed: secure_url not available in response.");
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error; // Re-throw to be handled by caller
  }
}

module.exports = { upload, fileSizeFormatter, handleUpload };

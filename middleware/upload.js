const multer = require('multer');
const ejs = require('ejs');
const express = require('express');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images are allowed'), false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;





// const multer = require('multer');
// const path = require('path');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // folder to save uploaded images
//   },
//   filename: function (req, file, cb) {
//     // Give the file a unique name
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // File filter (optional: only accept images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) cb(null, true);
//   else cb(new Error('Invalid file type. Only JPEG/PNG is allowed!'), false);
// };

// // Final multer upload setup
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });

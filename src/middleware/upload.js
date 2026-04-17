import multer from 'multer';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// export const upload = multer({ storage });

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default { upload }

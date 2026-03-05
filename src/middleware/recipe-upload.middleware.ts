import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folder exists
const uploadPath = "uploads/recipes";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const uploadRecipeImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
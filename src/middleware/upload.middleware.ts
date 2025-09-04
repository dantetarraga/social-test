import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";
import crypto from "crypto";

const uploadDir = path.join(__dirname, "../../uploads/posts");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/posts"));
  },
  filename: (req: Request, file, cb) => {
    const userId = req.user!.id;
    const randomId = crypto.randomBytes(4).toString("hex");
    const ext = path.extname(file.originalname);

    cb(null, `${userId}_${randomId}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadArray = (fieldName: string, maxCount?: number) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount?: number }[]) => upload.fields(fields);

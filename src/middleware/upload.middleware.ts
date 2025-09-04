import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/posts"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
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

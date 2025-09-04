import crypto from "crypto";
import path from "path";
import fs from "fs";
import { MediaItem } from "@/schema";

function generateFilename(userId: number, originalname: string): string {
  const randomId = crypto.randomBytes(4).toString("hex");
  const ext = path.extname(originalname);
  return `${userId}_${randomId}${ext}`;
}

function moveFile(tempPath: string, destPath: string): void {
  fs.renameSync(tempPath, destPath);
}

function buildMediaItem(file: Express.Multer.File, filename: string): MediaItem {
  return {
    url: `/uploads/posts/${filename}`,
    type: file.mimetype.startsWith("image") ? "image" : "video",
    filename,
  };
}

export function processFiles(files: Express.Multer.File[], userId: number): MediaItem[] {
  return files.map((file) => {
    const filename = generateFilename(userId, file.originalname);
    const destPath = path.join("uploads/posts", filename);

    moveFile(file.path, destPath);

    return buildMediaItem(file, filename);
  });
}

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import { Request } from "express";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req: Request, file: Express.Multer.File) => {
            const fileName = file.originalname
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9.-]/g, '')
                .replace(/-+/g, '-')
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName
            return uniqueFileName

        }
    }
})

export const multerUpload = multer({ storage: storage });

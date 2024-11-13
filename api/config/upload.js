// upload.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage dengan Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tinder-folder', // Nama folder di Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'], // Format yang diperbolehkan
    },
});

const upload = multer({ storage: storage });

export default upload;

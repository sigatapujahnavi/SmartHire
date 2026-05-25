// server/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smarthire/resumes',
    allowed_formats: ['pdf', 'docx', 'doc'],
    resource_type: 'raw',
  },
})

// Storage for profile images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smarthire/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'image',
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
})

export const uploadResume = multer({ storage: resumeStorage })
export const uploadImage = multer({ storage: imageStorage })
export { cloudinary }
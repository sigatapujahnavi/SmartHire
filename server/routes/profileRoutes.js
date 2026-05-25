// server/routes/profileRoutes.js
import express from 'express'
import {
  getProfile,
  saveIdentity,
  savePreferences,
  completeOnboarding,
  saveProfile,
  uploadAvatar,
  saveSettings
} from '../controllers/profileController.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { uploadImage } from '../config/cloudinary.js'

const router = express.Router()

router.get('/', protectRoute, getProfile)
router.put('/identity', protectRoute, saveIdentity)
router.put('/preferences', protectRoute, savePreferences)
router.put('/complete-onboarding', protectRoute, completeOnboarding)
router.put('/save', protectRoute, saveProfile)
router.post('/avatar', protectRoute, uploadImage.single('avatar'), uploadAvatar)
router.patch('/settings', protectRoute, saveSettings)
export default router
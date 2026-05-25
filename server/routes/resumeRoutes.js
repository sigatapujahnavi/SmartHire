// server/routes/resumeRoutes.js
import express from 'express'
import { uploadResume, deleteResume, getResume, analyzeResume, getAnalysis } from '../controllers/resumeController.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { uploadResume as uploadResumeMiddleware } from '../config/cloudinary.js'

const router = express.Router()

router.get('/', protectRoute, getResume)
router.post('/upload', protectRoute, uploadResumeMiddleware.single('resume'), uploadResume)
router.delete('/', protectRoute, deleteResume)
router.post('/analyze', protectRoute, analyzeResume)
router.get('/analysis', protectRoute, getAnalysis)

export default router
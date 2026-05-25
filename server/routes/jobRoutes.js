//server/routes/jobRoutes.js
import express from 'express'
import { searchJobs, getMatchScore, generateCoverLetter, generateResumeTailoring } from '../controllers/jobController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/search', protectRoute, searchJobs)
router.post('/match', protectRoute, getMatchScore)
router.post('/cover-letter', protectRoute, generateCoverLetter)
router.post('/tailor-resume', protectRoute, generateResumeTailoring)

export default router
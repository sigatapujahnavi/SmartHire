//server/routes/savedJobRoutes.js
import express from 'express'
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  getSavedJobIds,
  updateJobStatus,
} from '../controllers/savedJobController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/', protectRoute, saveJob)
router.delete('/:jobId', protectRoute, unsaveJob)
router.get('/', protectRoute, getSavedJobs)
router.get('/ids', protectRoute, getSavedJobIds)
router.patch('/:jobId/status', protectRoute, updateJobStatus)

export default router
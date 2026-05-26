// server/routes/digestRoutes.js
import express from 'express'
import { runDailyDigest } from '../services/digestService.js'
import { protectRoute } from '../middleware/protectRoute.js'
import DigestJob from '../models/DigestJob.js'

const router = express.Router()

// POST /api/digest/run — manual trigger (keep for cron testing, not exposed in UI)
router.post('/run', protectRoute, async (req, res) => {
  try {
    const result = await runDailyDigest(req.user._id)
    res.status(200).json({ message: 'Digest sent successfully', result })
  } catch (error) {
    console.error('DIGEST RUN ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
})

// POST /api/digest/cron-trigger — called by external cron service (no auth, secret key protected)
router.post('/cron-trigger', async (req, res) => {
  try {
    const secret = req.headers['x-cron-secret']
    if (secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    // Don't await — respond immediately so cron service doesn't timeout
    runDailyDigest().catch(err => console.error('[Cron Trigger] Failed:', err.message))
    res.status(200).json({ message: 'Digest triggered' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/digest/jobs — fetch last 3 days of digest jobs grouped by date
router.get('/jobs', protectRoute, async (req, res) => {
  try {
    const jobs = await DigestJob.find({ userId: req.user._id }).sort({ digestDate: -1, matchScore: -1 })

    // Group by digestDate
    const grouped = {}
    jobs.forEach(job => {
      if (!grouped[job.digestDate]) grouped[job.digestDate] = []
      grouped[job.digestDate].push(job)
    })

    // Build sorted array: [ { date: "2026-05-24", jobs: [...] }, ... ]
    const result = Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, jobs]) => ({ date, jobs }))

    res.status(200).json({ digestGroups: result })
  } catch (error) {
    console.error('GET DIGEST JOBS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
})

export default router
// server/server.js
//https://cloud.mongodb.com/v2/6a113cad630ce6b34c98f895#/explorer/6a113cf3ced441577bdf0674/smarthire/userprofiles/find

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import savedJobRoutes from './routes/savedJobRoutes.js'
import digestRoutes from './routes/digestRoutes.js'
import cron from 'node-cron'
import { runDailyDigest } from './services/digestService.js'



connectDB()

const app = express()

//app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/saved-jobs', savedJobRoutes)

app.use('/api/digest', digestRoutes)

// Daily Digest Agent — runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('[Cron] Daily Digest Agent triggered at 8 AM')
  try {
    await runDailyDigest()
  } catch (err) {
    console.error('[Cron] Digest Agent failed:', err.message)
  }
})


app.get('/api/health', (req, res) => {
  res.json({ status: 'SmartHire server running ✓' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
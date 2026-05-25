// server/models/DigestJob.js
import mongoose from 'mongoose'

const digestJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  digestDate: { type: String, required: true }, // "2026-05-24"
  title: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  type: { type: String, default: '' },
  salary: { type: String, default: '' },
  applyLink: { type: String, default: '' },
  logo: { type: String, default: '' },
  isRemote: { type: Boolean, default: false },
  posted: { type: String, default: '' },
  matchScore: { type: Number, default: 0 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
}, { timestamps: true })

// TTL index — MongoDB auto-deletes after 3 days
digestJobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
digestJobSchema.index({ userId: 1, digestDate: 1 })

export default mongoose.model('DigestJob', digestJobSchema)
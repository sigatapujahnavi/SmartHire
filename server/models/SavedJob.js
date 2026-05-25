//server/models/SavedJob.js
import mongoose from 'mongoose'

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: { type: String, required: true },
  title: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  type: { type: String, default: '' },
  salary: { type: String, default: '' },
  description: { type: String, default: '' },
  applyLink: { type: String, default: '' },
  logo: { type: String, default: '' },
  isRemote: { type: Boolean, default: false },
  posted: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Saved',
  },
  matchScore: { type: Number, default: 0 },
  savedAt: { type: Date, default: Date.now },
  appliedAt: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true })

// One user can save one job only once
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true })

export default mongoose.model('SavedJob', savedJobSchema)
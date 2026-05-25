// server/models/UserProfile.js
import mongoose from 'mongoose'

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // Step 1 — Identity
  professionalTitle: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },

  // Step 2 — Preferences
  desiredTitles: [{ type: String }],
 preferredLocation: { type: String, default: '' },
  preferredLocations: [{ type: String }],
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  workType: { type: String, enum: ['Remote', 'Hybrid', 'On-site', ''], default: '' },

  // Step 3 — Resume
  resumeUrl: { type: String, default: '' },
  resumePublicId: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  resumeUploadedAt: { type: Date },

  // Profile image
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },

  // Skills
  skills: [{ type: String }],

// Onboarding status
  onboardingCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },

  // ATS Analysis
  atsScore: { type: Number, default: 0 },
  atsScores: {
    keywords: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    skillsAlignment: { type: Number, default: 0 },
  },
atsRecommendations: [{ 
    icon: String, 
    title: String, 
    desc: String 
  }],
  atsTopSkillsFound: [{ type: String }],
atsAnalyzedAt: { type: Date },

  // Settings
  digestEnabled: { type: Boolean, default: true },

}, { timestamps: true })

export default mongoose.model('UserProfile', userProfileSchema)
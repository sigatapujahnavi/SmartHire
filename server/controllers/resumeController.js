// server/controllers/resumeController.js
import UserProfile from '../models/UserProfile.js'
import { cloudinary } from '../config/cloudinary.js'
import { analyzeResumeWithAI } from '../services/aiService.js'

// POST — upload resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    // Delete old resume from cloudinary if exists
    const existing = await UserProfile.findOne({ userId: req.user._id })
    if (existing?.resumePublicId) {
      await cloudinary.uploader.destroy(existing.resumePublicId, { resource_type: 'raw' })
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        resumeUrl: req.file.path,
        resumePublicId: req.file.filename,
        resumeOriginalName: req.file.originalname,
        resumeUploadedAt: new Date(),
      },
      { new: true, upsert: true }
    )

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: req.file.path,
      resumeOriginalName: req.file.originalname,
      profile,
    })
  } catch (error) {
    console.error('UPLOAD RESUME ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// DELETE — delete resume
export const deleteResume = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile?.resumePublicId) {
      return res.status(400).json({ message: 'No resume found' })
    }

    await cloudinary.uploader.destroy(profile.resumePublicId, { resource_type: 'raw' })

    profile.resumeUrl = ''
    profile.resumePublicId = ''
    profile.resumeOriginalName = ''
    profile.resumeUploadedAt = null
    await profile.save()

    res.status(200).json({ message: 'Resume deleted' })
  } catch (error) {
    console.error('DELETE RESUME ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// GET — get resume info
export const getResume = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile?.resumeUrl) {
      return res.status(200).json({ resume: null })
    }
    res.status(200).json({
      resume: {
        url: profile.resumeUrl,
        originalName: profile.resumeOriginalName,
        uploadedAt: profile.resumeUploadedAt,
      }
    })
  } catch (error) {
    console.error('GET RESUME ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// POST — analyze resume with Gemini AI
export const analyzeResume = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile?.resumeUrl) {
      return res.status(400).json({ message: 'No resume found. Please upload a resume first.' })
    }

  const { analysis } = await analyzeResumeWithAI(profile.resumeUrl)

    // Save scores to DB
    await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
     {
        atsScore: analysis.overallScore,
        atsScores: analysis.scores,
        atsRecommendations: analysis.recommendations,
        atsTopSkillsFound: analysis.topSkillsFound || [],
        atsAnalyzedAt: new Date(),
      }
    )

    res.status(200).json({ analysis })
  } catch (error) {
    console.error('ANALYZE RESUME ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// GET — get saved analysis
export const getAnalysis = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile?.atsScore) {
      return res.status(200).json({ analysis: null })
    }
    res.status(200).json({
      analysis: {
        overallScore: profile.atsScore,
        scores: profile.atsScores,
        recommendations: profile.atsRecommendations,
        analyzedAt: profile.atsAnalyzedAt,
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
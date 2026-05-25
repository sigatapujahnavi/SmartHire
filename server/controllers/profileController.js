// server/controllers/profileController.js
import UserProfile from '../models/UserProfile.js'
import User from '../models/User.js'

// GET — fetch profile
export const getProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = await UserProfile.create({ userId: req.user._id })
    }
    res.status(200).json({ profile })
  } catch (error) {
    console.error('GET PROFILE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PUT — save identity (step 1)
export const saveIdentity = async (req, res) => {
  try {
    const { professionalTitle, location, bio } = req.body
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { professionalTitle, location, bio, onboardingStep: 1 },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Identity saved', profile })
  } catch (error) {
    console.error('SAVE IDENTITY ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PUT — save preferences (step 2)
export const savePreferences = async (req, res) => {
  try {
    const { desiredTitles, preferredLocation, salaryMin, salaryMax, workType } = req.body
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { desiredTitles, preferredLocation, salaryMin, salaryMax, workType, onboardingStep: 2 },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Preferences saved', profile })
  } catch (error) {
    console.error('SAVE PREFERENCES ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PUT — complete onboarding
export const completeOnboarding = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { onboardingCompleted: true, onboardingStep: 3 },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Onboarding complete', profile })
  } catch (error) {
    console.error('COMPLETE ONBOARDING ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PUT — save full profile (from Profile page)
export const saveProfile = async (req, res) => {
  try {
const { professionalTitle, location, bio, skills, desiredTitles, preferredLocation, preferredLocations, salaryMin, salaryMax, workType, fullName } = req.body

  // Merge skills from resume ATS analysis
  const existingProfile = await UserProfile.findOne({ userId: req.user._id })
  const resumeSkills = existingProfile?.atsTopSkillsFound || []
  const mergedSkills = [...new Set([...(skills || []), ...resumeSkills])]

  const profile = await UserProfile.findOneAndUpdate(
    { userId: req.user._id },
    { professionalTitle, location, bio, skills: mergedSkills, desiredTitles, preferredLocation, preferredLocations, salaryMin, salaryMax, workType },
    { new: true, upsert: true }
  )
  if (fullName) {
    await User.findByIdAndUpdate(req.user._id, { fullName })
  }
  res.status(200).json({ message: 'Profile saved successfully', profile })
  } catch (error) {
    console.error('SAVE PROFILE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// POST — upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' })

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        avatarUrl: req.file.path,
        avatarPublicId: req.file.filename,
      },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Avatar uploaded', avatarUrl: req.file.path, profile })
  } catch (error) {
    console.error('UPLOAD AVATAR ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PATCH — save settings
export const saveSettings = async (req, res) => {
  try {
    const { digestEnabled } = req.body
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { digestEnabled },
      { new: true, upsert: true }
    )
    res.status(200).json({ message: 'Settings saved', profile })
  } catch (error) {
    console.error('SAVE SETTINGS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
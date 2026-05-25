//server/controllers/savedJobController.js
import SavedJob from '../models/SavedJob.js'

// POST — save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId, title, company, location, type, salary, description, applyLink, logo, isRemote, posted, matchScore } = req.body

    if (!jobId) return res.status(400).json({ message: 'Job ID is required' })

    const existing = await SavedJob.findOne({ userId: req.user._id, jobId })
    if (existing) {
      return res.status(400).json({ message: 'Job already saved', savedJob: existing })
    }

    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId, title, company, location, type, salary,
      description, applyLink, logo, isRemote, posted,
      matchScore: matchScore || 0,
    })

    res.status(201).json({ message: 'Job saved successfully', savedJob })
  } catch (error) {
    console.error('SAVE JOB ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// DELETE — unsave a job
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params
    await SavedJob.findOneAndDelete({ userId: req.user._id, jobId })
    res.status(200).json({ message: 'Job removed from saved' })
  } catch (error) {
    console.error('UNSAVE JOB ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// GET — get all saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id }).sort({ savedAt: -1 })
    res.status(200).json({ savedJobs })
  } catch (error) {
    console.error('GET SAVED JOBS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// GET — get saved job IDs only (for checking bookmark state)
export const getSavedJobIds = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id }).select('jobId status matchScore')
    res.status(200).json({ savedJobs })
  } catch (error) {
    console.error('GET SAVED JOB IDS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// PATCH — update job status (Saved → Applied → Interview etc)
export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params
    const { status, notes } = req.body

    const update = { status }
    if (status === 'Applied') update.appliedAt = new Date()
    if (notes !== undefined) update.notes = notes

    const savedJob = await SavedJob.findOneAndUpdate(
      { userId: req.user._id, jobId },
      update,
      { new: true }
    )

    if (!savedJob) return res.status(404).json({ message: 'Saved job not found' })

    res.status(200).json({ message: 'Status updated', savedJob })
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
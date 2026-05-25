//server/controllers/jobController.js
import fetch from 'node-fetch'
import UserProfile from '../models/UserProfile.js'
import { calculateMatchScore } from '../services/aiService.js'

export const searchJobs = async (req, res) => {
  try {
    const { query = 'developer', location = '', type = '', page = 1, datePosted = '', remoteOnly = '' } = req.query

    const searchQuery = location ? `${query} in ${location}` : query

    let url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1`
    
    if (type) url += `&employment_types=${type}`
    if (datePosted) url += `&date_posted=${datePosted}`
    if (remoteOnly === 'true') url += `&remote_jobs_only=true`

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': process.env.JSEARCH_API_KEY,
      }
    })

    const data = await response.json()

    if (!data.data) {
      return res.status(500).json({ message: 'Failed to fetch jobs' })
    }

    const jobs = data.data.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country || 'Remote',
      type: job.job_employment_type || 'FULLTIME',
      salary: job.job_min_salary && job.job_max_salary
        ? `$${Math.round(job.job_min_salary / 1000)}k–$${Math.round(job.job_max_salary / 1000)}k`
        : 'Not disclosed',
      posted: job.job_posted_at_datetime_utc
        ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
        : 'Recently',
      description: job.job_description || '',
      highlights: job.job_highlights || {},
      applyLink: job.job_apply_link || '',
      logo: job.employer_logo || '',
      isRemote: job.job_is_remote || false,
      requiredExperience: job.job_required_experience?.required_experience_in_months || null,
    }))

    res.status(200).json({ jobs, total: data.data.length })
  } catch (error) {
    console.error('JOB SEARCH ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

export const getMatchScore = async (req, res) => {
  try {
    const { jobDescription, jobTitle, jobCompany } = req.body

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' })
    }

    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile) {
      return res.status(400).json({ message: 'Please complete your profile first' })
    }

    let resumeText = ''
    if (profile.resumeUrl) {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
        const fetch2 = await import('node-fetch')
        const pdfRes = await fetch2.default(profile.resumeUrl)
        const arrayBuffer = await pdfRes.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          resumeText += content.items.map(item => item.str).join(' ') + '\n'
        }
      } catch (e) {
        console.error('PDF extract error (non-fatal):', e.message)
      }
    }

    const match = await calculateMatchScore(jobDescription, profile, resumeText)
    res.status(200).json({ match })
  } catch (error) {
    console.error('MATCH SCORE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, jobTitle, jobCompany } = req.body
    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' })

    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(400).json({ message: 'Please complete your profile first' })

    // Extract resume text
    let resumeText = ''
    if (profile.resumeUrl) {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
        const fetch2 = await import('node-fetch')
        const pdfRes = await fetch2.default(profile.resumeUrl)
        const arrayBuffer = await pdfRes.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          resumeText += content.items.map(item => item.str).join(' ') + '\n'
        }
      } catch (e) {
        console.error('PDF extract error:', e.message)
      }
    }

    const { default: Groq } = await import('groq-sdk')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer. Write professional, personalized cover letters based on the candidate resume and job description.'
        },
        {
          role: 'user',
          content: `Write a professional cover letter for this job application.

Job Title: ${jobTitle}
Company: ${jobCompany}
Job Description: ${jobDescription}

Candidate Resume:
${resumeText}

Instructions:
- Address it to "Hiring Manager"
- 3-4 paragraphs, concise and impactful
- Reference specific skills from the resume that match the job
- Mention specific projects or experience that are relevant
- Professional but not robotic tone
- End with a confident call to action
- Do NOT include placeholder text like [Your Name] — use the actual name from resume if available
- Return ONLY the cover letter text, no extra commentary`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const coverLetter = completion.choices[0].message.content.trim()
    res.status(200).json({ coverLetter })
  } catch (error) {
    console.error('COVER LETTER ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
export const generateResumeTailoring = async (req, res) => {
  try {
    const { jobDescription, jobTitle, jobCompany } = req.body
    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' })

    const profile = await UserProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(400).json({ message: 'Please complete your profile first' })

    // Extract resume text
    let resumeText = ''
    if (profile.resumeUrl) {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
        const fetch2 = await import('node-fetch')
        const pdfRes = await fetch2.default(profile.resumeUrl)
        const arrayBuffer = await pdfRes.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          resumeText += content.items.map(item => item.str).join(' ') + '\n'
        }
      } catch (e) {
        console.error('PDF extract error:', e.message)
      }
    }

    const { default: Groq } = await import('groq-sdk')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS resume consultant. Always respond with valid JSON only, no markdown, no extra text.'
        },
        {
          role: 'user',
          content: `Analyze this candidate's resume against the job description and give specific actionable tailoring suggestions.

Job Title: ${jobTitle}
Company: ${jobCompany}
Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Return ONLY this JSON structure:
{
  "overallFit": "<1 sentence honest assessment>",
  "suggestions": [
    {
      "section": "<which resume section to change: Skills / Experience / Summary / Projects>",
      "priority": "<High / Medium / Low>",
      "action": "<exactly what to add, change or reword>",
      "reason": "<why this helps for this specific job>"
    }
  ],
  "keywordsToAdd": ["keyword1", "keyword2", "keyword3"],
  "strengthsToHighlight": ["strength1", "strength2", "strength3"]
}

Rules:
- suggestions must have 5 to 7 items
- be SPECIFIC — mention actual project names, actual skills from resume
- only suggest things that are genuinely missing or can be improved
- keywordsToAdd must be keywords from job description NOT already in resume
- strengthsToHighlight must be things already in resume that perfectly match this job
- return ONLY the JSON, nothing else`
        }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    })

    const text = completion.choices[0].message.content
    const cleaned = text.replace(/```json|```/g, '').trim()
    const tailoring = JSON.parse(cleaned)

    res.status(200).json({ tailoring })
  } catch (error) {
    console.error('RESUME TAILORING ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
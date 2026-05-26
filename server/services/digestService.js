//server/services/digestService.js
import fetch from 'node-fetch'
//import nodemailer from 'nodemailer'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import UserProfile from '../models/UserProfile.js'
import User from '../models/User.js'
import DigestJob from '../models/DigestJob.js'
import { calculateMatchScore } from './aiService.js'

// ── Extract resume text from Cloudinary PDF URL ──
const extractResumeText = async (resumeUrl) => {
  try {
    const response = await fetch(resumeUrl)
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item) => item.str).join(' ') + '\n'
    }
    return text
  } catch (err) {
    console.error('PDF extract error in digest:', err.message)
    return ''
  }
}

// ── Fetch jobs from JSearch for a given title + location ──
const fetchJobsForUser = async (desiredTitles, preferredLocations) => {
  try {
    const title = desiredTitles[0] || 'developer'
    const location = preferredLocations?.[0] || ''
    const query = location ? `${title} in ${location}` : title

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': process.env.JSEARCH_API_KEY,
      },
    })

    const data = await response.json()
    if (!data.data) return []

    return data.data.slice(0, 10).map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country || 'Remote',
      type: job.job_employment_type || 'FULLTIME',
      salary:
        job.job_min_salary && job.job_max_salary
          ? `$${Math.round(job.job_min_salary / 1000)}k–$${Math.round(job.job_max_salary / 1000)}k`
          : 'Not disclosed',
      description: job.job_description || '',
      applyLink: job.job_apply_link || '',
      logo: job.employer_logo || '',
      isRemote: job.job_is_remote || false,
      posted: job.job_posted_at_datetime_utc
        ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
        : 'Recently',
    }))
  } catch (err) {
    console.error('JSearch fetch error in digest:', err.message)
    return []
  }
}

// ── Build HTML email ──
const buildEmailHTML = (userName, topJobs) => {
  const jobCards = topJobs
    .map(
      (job, i) => `
    <div style="background:#1a2332;border:1px solid #ffffff15;border-radius:12px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div>
          <p style="color:#ffffff;font-weight:700;font-size:14px;margin:0 0 2px 0;">${job.title}</p>
          <p style="color:#94A3B8;font-size:12px;margin:0;">${job.company} · ${job.location}</p>
        </div>
        <div style="background:#00D4AA20;border:1px solid #00D4AA40;border-radius:20px;padding:4px 10px;white-space:nowrap;">
          <span style="color:#00D4AA;font-size:11px;font-weight:700;">${job.matchScore}% Match</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <span style="background:#ffffff10;color:#94A3B8;font-size:10px;padding:3px 8px;border-radius:6px;">${job.type}</span>
        <span style="background:#ffffff10;color:#94A3B8;font-size:10px;padding:3px 8px;border-radius:6px;">${job.salary}</span>
        ${job.isRemote ? '<span style="background:#0099FF20;color:#0099FF;font-size:10px;padding:3px 8px;border-radius:6px;">Remote</span>' : ''}
      </div>
      <a href="${job.applyLink}" 
         style="display:inline-block;background:linear-gradient(135deg,#00D4AA,#0099FF);color:#ffffff;font-size:12px;font-weight:600;padding:8px 20px;border-radius:8px;text-decoration:none;">
        Apply Now →
      </a>
    </div>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0D1321;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:16px;">
        <div style="background:linear-gradient(135deg,#00D4AA,#0099FF);width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:16px;">⚡</span>
        </div>
        <span style="color:#ffffff;font-weight:700;font-size:18px;">SmartHire</span>
        <span style="color:#94A3B8;font-size:11px;background:#ffffff10;padding:2px 8px;border-radius:4px;">AI TALENT ENGINE</span>
      </div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px 0;">
        Your Daily Job Digest ☀️
      </h1>
      <p style="color:#94A3B8;font-size:13px;margin:0;">
        Good morning, ${userName}! Here are your top AI-matched opportunities for today.
      </p>
    </div>

    <!-- Jobs -->
    <div style="margin-bottom:24px;">
      <p style="color:#00D4AA;font-size:10px;font-weight:700;letter-spacing:2px;margin:0 0 12px 0;">
        ● TOP ${topJobs.length} MATCHES TODAY
      </p>
      ${jobCards}
    </div>

    <!-- CTA -->
    <div style="background:#111827;border:1px solid #ffffff10;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#ffffff;font-size:13px;font-weight:600;margin:0 0 8px 0;">
        Want more matches?
      </p>
      <p style="color:#94A3B8;font-size:12px;margin:0 0 16px 0;">
        Search thousands of jobs and get AI match scores instantly.
      </p>
      <a href="${process.env.CLIENT_URL}/jobs"
         style="display:inline-block;background:linear-gradient(135deg,#00D4AA,#0099FF);color:#ffffff;font-size:12px;font-weight:600;padding:10px 24px;border-radius:8px;text-decoration:none;">
        Search Jobs →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;">
      <p style="color:#4B5563;font-size:11px;margin:0;">
        SmartHire AI · You're receiving this because you enabled daily digest.<br/>
        <a href="${process.env.CLIENT_URL}/profile" style="color:#4B5563;">Manage preferences</a>
      </p>
    </div>

  </div>
</body>
</html>
  `
}

// ── Send email via Nodemailer ──
const sendDigestEmail = async (toEmail, userName, topJobs) => {
  const html = buildEmailHTML(userName, topJobs)
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'SmartHire AI', email: 'janupotti24@gmail.com' },
      to: [{ email: toEmail, name: userName }],
      subject: `☀️ Your Daily Job Digest — ${topJobs.length} AI-Matched Jobs Today`,
      htmlContent: html,
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send digest email')
  }
}

// ── MAIN AGENT FUNCTION ──
// Pass userId for manual trigger (single user), or null for cron (all users)
export const runDailyDigest = async (userId = null) => {
  console.log(`[Digest Agent] Starting — ${new Date().toISOString()}`)

  const results = { processed: 0, skipped: 0, failed: 0, emails: [] }

  try {
    // Fetch profiles — single user or all eligible users
   const query = {
      resumeUrl: { $ne: '' },
      desiredTitles: { $exists: true, $not: { $size: 0 } },
      digestEnabled: { $ne: false },
    }
    if (userId) query.userId = userId

    const profiles = await UserProfile.find(query).lean()

    if (profiles.length === 0) {
      console.log('[Digest Agent] No eligible profiles found')
      return { ...results, message: 'No eligible profiles. Add desired job titles and upload a resume first.' }
    }

    console.log(`[Digest Agent] Processing ${profiles.length} profile(s)`)

    for (const profile of profiles) {
      try {
        // Get user email + name
        const user = await User.findById(profile.userId).lean()
        if (!user?.email) { results.skipped++; continue }

        console.log(`[Digest Agent] Processing: ${user.email}`)

        // 1 — Extract resume text
        const resumeText = await extractResumeText(profile.resumeUrl)
        if (!resumeText) {
          console.log(`[Digest Agent] Skipping ${user.email} — no resume text`)
          results.skipped++
          continue
        }

        // 2 — Fetch jobs from JSearch
        const jobs = await fetchJobsForUser(
          profile.desiredTitles,
          profile.preferredLocations
        )
        if (jobs.length === 0) {
          console.log(`[Digest Agent] No jobs found for ${user.email}`)
          results.skipped++
          continue
        }

        // 3 — AI score each job against resume
        console.log(`[Digest Agent] Scoring ${jobs.length} jobs for ${user.email}`)
        const scoredJobs = []

        for (const job of jobs) {
          try {
            const match = await calculateMatchScore(job.description, profile, resumeText)
            scoredJobs.push({ ...job, matchScore: match.matchScore, recommendation: match.recommendation })
          } catch (err) {
            console.error(`[Digest Agent] Score error for job ${job.id}:`, err.message)
            scoredJobs.push({ ...job, matchScore: 0, recommendation: 'Consider' })
          }
        }

        // 4 — Sort by score, pick top 5
        const topJobs = scoredJobs
          .filter((j) => j.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5)

        if (topJobs.length === 0) {
          console.log(`[Digest Agent] No scored jobs for ${user.email}`)
          results.skipped++
          continue
        }

       // 5 — Save to DigestJob collection (keep last 3 days)
        const today = new Date().toISOString().split('T')[0] // "2026-05-24"

        // Delete today's existing digest for this user (in case of re-run)
        await DigestJob.deleteMany({ userId: profile.userId, digestDate: today })

        // Delete anything older than 3 days
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        await DigestJob.deleteMany({ userId: profile.userId, createdAt: { $lt: threeDaysAgo } })

        // Insert today's top jobs
        await DigestJob.insertMany(
          topJobs.map(job => ({
            userId: profile.userId,
            digestDate: today,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary,
            applyLink: job.applyLink,
            logo: job.logo,
            isRemote: job.isRemote,
            posted: job.posted,
            matchScore: job.matchScore,
          }))
        )

        // 6 — Send email
        await sendDigestEmail(user.email, user.fullName || 'there', topJobs)

        console.log(`[Digest Agent] ✓ Sent ${topJobs.length} jobs to ${user.email}`)
        results.processed++
        results.emails.push({ email: user.email, jobsSent: topJobs.length })

      } catch (err) {
        console.error(`[Digest Agent] Failed for profile ${profile._id}:`, err.message)
        results.failed++
      }
    }

  } catch (err) {
    console.error('[Digest Agent] Fatal error:', err.message)
    throw err
  }

  console.log(`[Digest Agent] Done — processed:${results.processed} skipped:${results.skipped} failed:${results.failed}`)
  return results
}
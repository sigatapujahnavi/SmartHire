//server/services/aiService.js
import Groq from 'groq-sdk'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import fetch from 'node-fetch'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const analyzeResumeWithAI = async (resumeUrl) => {
  // Fetch PDF from Cloudinary
  const response = await fetch(resumeUrl)
  const arrayBuffer = await response.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  // Extract text from PDF
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
  const pdf = await loadingTask.promise
  let resumeText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    resumeText += content.items.map(item => item.str).join(' ') + '\n'
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract text from resume PDF')
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS resume analyzer. Always respond with valid JSON only, no markdown, no extra text.'
      },
      {
        role: 'user',
        content: `Analyze this resume and return ONLY a valid JSON object:

Resume:
${resumeText}

Return exactly this structure:
{
  "overallScore": <number 0-100>,
  "scores": {
    "keywords": <number 0-100>,
    "formatting": <number 0-100>,
    "readability": <number 0-100>,
    "skillsAlignment": <number 0-100>
  },
  "recommendations": [
    {
      "icon": "<emoji>",
      "title": "<short title>",
      "desc": "<detailed description>"
    }
  ],
"topSkillsFound": ["skill1", "skill2", "skill3", "...extract ALL skills mentioned"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- recommendations must have exactly 3 items
- icons must be emojis like ✅ ⚠️ 📍 💡 🔧
- be specific based on actual resume content
- topSkillsFound must include EVERY technical skill mentioned (target 30+ skills)
- extract ALL: programming languages, frameworks, libraries, databases, cloud services, tools, mobile tech, DevOps tools
- examples of what to look for: React.js, Node.js, Express.js, MongoDB, MySQL, PostgreSQL, TypeScript, JavaScript, Java, Spring Boot, AWS, Docker, Redis, React Native, Next.js, Tailwind CSS, Git, Firebase, WebSockets, JWT, REST APIs, GraphQL, CI/CD, Kubernetes etc
- return ONLY the JSON, nothing else`
      }
    ],
temperature: 0.3,
    max_tokens: 2000,
  })

  const text = completion.choices[0].message.content
  const cleaned = text.replace(/```json|```/g, '').trim()
  const analysis = JSON.parse(cleaned)

  return { analysis, resumeText }
}

export const calculateMatchScore = async (jobDescription, userProfile, resumeText = '') => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert job match analyzer. Always respond with valid JSON only, no markdown, no extra text.'
      },
      {
        role: 'user',
      content: `You are a strict, fair resume-to-job matcher. Compare the candidate's resume against the job description.

CRITICAL RULES:
- If a skill appears ANYWHERE in the resume text, it is a MATCHED skill, not missing
- Only mark a skill as missing if it is completely absent from the entire resume text
- Match skills semantically: "Razorpay / Payment Gateways" = "Payment gateway integration", "CI/CD" = "CI/CD pipelines", "Docker" = "containerization", "AWS" = "cloud deployment" etc
- Do not require exact keyword match — if the concept is covered, it is MATCHED
- Do not penalize for having MORE skills than required
- matchScore should reflect true alignment based on actual resume content

Job Description:
${jobDescription}

Candidate Resume (source of truth for all skills):
${resumeText}

Additional Profile Info:
- Title: ${userProfile.professionalTitle}
- Location: ${userProfile.location}
- Preferred Locations: ${userProfile.preferredLocations?.join(', ') || userProfile.preferredLocation || 'Open to all'}
- Work Type: ${userProfile.workType || 'Any'}
- Desired Titles: ${userProfile.desiredTitles?.join(', ') || 'Not specified'}

Return ONLY this JSON, no extra text:
{
  "matchScore": <number 0-100>,
  "skillsMatch": {
    "matched": ["skill1", "skill2"],
    "missing": ["skill1", "skill2"]
  },
  "experienceMatch": "<Matched|Partial|Not Matched>",
  "locationMatch": "<Matched|Remote|Not Matched>",
  "summary": "<2 sentence summary>",
  "recommendation": "<Apply|Consider|Skip>"
}`
      }
    ],
    temperature: 0.3,
    max_tokens: 500,
  })

  const text = completion.choices[0].message.content
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
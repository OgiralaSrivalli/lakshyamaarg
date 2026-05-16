const pool = require('../../config/db');
const roadmaps = require('./roadmaps');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const getRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch latest assessment
        const assessmentResult = await pool.query(
            'SELECT scores, top_domain, explanation FROM assessment_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        if (assessmentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No assessment found. Please complete the psychometric test first.' });
        }

        let { scores, top_domain, explanation } = assessmentResult.rows[0];
        // SQLite stores JSON as a string — parse it
        if (typeof scores === 'string') { try { scores = JSON.parse(scores); } catch (_) { } }

        // Fetch user stream for additional context
        const userResult = await pool.query('SELECT stream, education_level FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        let roadmap = roadmaps[top_domain];

        // If Gemini is available, generate a highly personalized, dynamic roadmap exploring broader paths
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                const prompt = `You are a world-class Indian career counselor.
Based on this user's profile:
Education: ${user.education_level}
Stream/Branch: ${user.stream}
Psychometric Scores (out of 100): ${JSON.stringify(scores)}
Primary Domain calculation (for context only): ${top_domain}

Generate a highly specific, unique, and personalized career roadmap. 
CRITICAL RULE: You can suggest ANY job relevant to the outcome of the assessment from ALL OVER THE WORLD. You are completely UNRESTRICTED and should NOT stick to just 5 default careers or the primary domain. Explore all possible, highly specific, broader/niche career domains that fit these exact psychometric scores perfectly (e.g., if high in Medical and Analytical, maybe Bioinformatics, HealthTech, or Neurotechnology).

Return ONLY a valid JSON object matching exactly this structure (no markdown tags, no extra text):
{
  "key": "custom_generated",
  "title": "Specific Role / Field (e.g. AI Healthcare Engineer)",
  "icon": "A single emoji",
  "color": "A hex color code (e.g. #6366f1)",
  "tagline": "A catchy phrase",
  "requiredSubjects": ["sub 1", "sub 2", "sub 3"],
  "entranceExams": ["exam 1", "exam 2"],
  "degreeDuration": "String describing timeline",
  "topColleges": ["col 1", "col 2", "col 3"],
  "salaryRange": "String in INR (e.g. ₹8-40 LPA)",
  "careerGrowth": "A string describing the ladder A -> B -> C",
  "milestones": [
    { "year": "Now", "title": "...", "desc": "..." },
    { "year": "Year 1", "title": "...", "desc": "..." },
    { "year": "Year 2-3", "title": "...", "desc": "..." },
    { "year": "Year 4", "title": "...", "desc": "..." },
    { "year": "Post Grad", "title": "...", "desc": "..." }
  ]
}`;
                const result = await model.generateContent(prompt);
                let text = result.response.text().trim();
                // Strip markdown blocks if present
                if (text.startsWith('\`\`\`json')) {
                    text = text.substring(7, text.length - 3).trim();
                } else if (text.startsWith('\`\`\`')) {
                    text = text.substring(3, text.length - 3).trim();
                }
                const customRoadmap = JSON.parse(text);
                roadmap = customRoadmap;
            } catch (err) {
                console.error("Failed to generate dynamic AI roadmap, falling back to static:", err);
            }
        }

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found for domain: ' + top_domain });
        }

        // All roadmaps (for browsing)
        const allRoadmaps = Object.values(roadmaps).map(r => ({
            key: r.key,
            title: r.title,
            icon: r.icon,
            color: r.color,
            tagline: r.tagline,
        }));

        res.json({
            success: true,
            recommendation: {
                top_domain,
                explanation,
                scores,
                roadmap,
                stream: user.stream,
                education_level: user.education_level,
            },
            all_roadmaps: allRoadmaps,
        });
    } catch (err) {
        console.error('Recommendation error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching recommendation' });
    }
};

const getRoadmapByKey = (req, res) => {
    const { key } = req.params;
    const roadmap = Object.values(roadmaps).find(r => r.key === key);
    if (!roadmap) {
        return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }
    res.json({ success: true, roadmap });
};

module.exports = { getRecommendation, getRoadmapByKey };

const knowledgeBase = require('./knowledgeBase');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../../config/db');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const chat = async (req, res) => {
    try {
        const { message, language = 'en', parent_mode = false } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const lang = language === 'te' ? 'te' : 'en';
        const kb = knowledgeBase[lang];

        // Fetch User Context
        let userContext = "No prior assessment data found.";
        if (req.user && req.user.id) {
            try {
                const userResult = await pool.query('SELECT name, education_level, stream FROM users WHERE id = $1', [req.user.id]);
                const assessmentResult = await pool.query('SELECT scores, top_domain FROM assessment_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);
                if (userResult.rows.length > 0) {
                    const u = userResult.rows[0];
                    const a = assessmentResult.rows[0];
                    userContext = `User Name: ${u.name}\nEducation: ${u.education_level} (Stream: ${u.stream})`;
                    if (a) {
                        userContext += `\nRecommended Domain: ${a.top_domain}\nPsychometric Scores: ${a.scores}`;
                    }
                }
            } catch (err) {
                console.error("Error fetching context:", err);
            }
        }

        // 1. If Gemini API Key is available, use LLM RAG
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

                // Build knowledge context (RAG Context)
                let context = kb.topics.map(t => t.response).join('\n\n');

                let prompt = `You are LakshyaBot, an expert AI career intelligence guide designed for Indian students.
You must base your answer primarily on the following knowledge base snippets if they are relevant. If not explicitly covered, provide a helpful and encouraging answer based on your general knowledge.

=== KNOWLEDGE BASE ===
${context}
======================

=== USER PROFILE ===
${userContext}
======================

User's language preference: ${lang === 'te' ? 'Telugu' : 'English'}
Parent Mode Active: ${parent_mode ? 'Yes. You MUST explain the career, its financial stability, respectability, and benefits formally to convince traditional Indian parents.' : 'No. Speak directly to the student in a friendly, encouraging way.'}

Important: Keep the response formatted using Markdown (with bold, lists, and emojis). Personalize your response using the User Profile if it is helpful. Do NOT mention that you used a context.

User Message: "${message}"`;

                const result = await model.generateContent(prompt);
                const response = result.response.text();

                return res.json({ success: true, response, language: lang, parent_mode, rag: true });
            } catch (llmError) {
                console.error("LLM Generation Failed, falling back to keyword logic:", llmError);
                // Fall down to the exact keyword match block below
            }
        }

        // 2. Fallback: Local Keyword Matching (Original Logic)
        const lowerMsg = message.toLowerCase().replace(/[\s,]/g, '');

        // Check for greetings
        const greetWords = ['hi', 'hello', 'hey', 'namaskaram', 'namaste', 'helo', 'vanakkam'];
        if (greetWords.some(g => lowerMsg.includes(g))) {
            return res.json({ success: true, response: kb.greetings[0], language: lang });
        }

        // Find matching topic
        let matched = null;
        for (const topic of kb.topics) {
            if (topic.keywords.some(kw => lowerMsg.includes(kw.toLowerCase()))) {
                matched = topic;
                break;
            }
        }

        let responseText = matched ? matched.response : kb.fallback;

        // Parent mode wrapper
        if (parent_mode && matched) {
            const domain = detectDomain(matched.keywords[0]);
            responseText = knowledgeBase.parent.intro(domain) + responseText + knowledgeBase.parent.suffix;
        }

        return res.json({ success: true, response: responseText, language: lang, parent_mode, rag: false });
    } catch (err) {
        console.error('Chatbot error:', err);
        res.status(500).json({ success: false, message: 'Chatbot error' });
    }
};

const detectDomain = (keyword) => {
    const map = {
        ai: 'AI/ML Engineering',
        engineering: 'Engineering',
        btech: 'B.Tech',
        mbbs: 'Medicine',
        doctor: 'Medicine',
        neet: 'Medical (NEET)',
        law: 'Law',
        clat: 'Law',
        business: 'Business / MBA',
        mba: 'MBA',
        bba: 'BBA / Business',
        design: 'Multimedia & Design',
        creative: 'Creative Design',
        tech: 'Technology',
        software: 'Software Engineering',
    };
    return map[keyword] || 'your chosen career';
};

module.exports = { chat };

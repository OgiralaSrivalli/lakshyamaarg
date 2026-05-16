const pool = require('../../config/db');
const questions = require('./questions');

// Get all questions (strip scores so client can't cheat)
const getQuestions = (req, res) => {
    // Determine user tier for adaptive testing
    const edu = req.user.education_level || '10th';
    const tier = edu.includes('10th') || edu.includes('9th') ? '10th' :
        edu.includes('11th') || edu.includes('12th') ? '12th' : 'B.Tech';

    // Filter questions by tier and fallback to '10th' if none exist
    let poolQuestions = questions.filter(q => q.tier === tier);
    if (poolQuestions.length === 0) poolQuestions = questions.filter(q => q.tier === '10th');

    // Shuffle and pick top N
    const shuffled = poolQuestions.sort(() => 0.5 - Math.random());
    // We serve 10 adaptive questions 
    const selected = shuffled.slice(0, 10);

    const safeQuestions = selected.map(q => ({
        id: q.id,
        domain: q.domain,
        question: q.question,
        options: q.options.map(o => ({ label: o.label, text: o.text })),
    }));
    res.json({ success: true, questions: safeQuestions, total: safeQuestions.length });
};

// Calculate percentage per domain
const scoreDomains = (answers) => {
    const domainScores = { analytical: 0, creativity: 0, leadership: 0, medical: 0, business: 0 };
    const domainMax = { analytical: 0, creativity: 0, leadership: 0, medical: 0, business: 0 };

    // Instead of scoring ALL questions in the file, only score the ones the user answered
    Object.keys(answers).forEach(questionId => {
        const q = questions.find(x => x.id.toString() === questionId);
        if (q) {
            domainMax[q.domain] += 3; // Best possible score for a question
            const userAnswer = answers[questionId];
            if (userAnswer) {
                const option = q.options.find(o => o.label === userAnswer);
                if (option) domainScores[q.domain] += option.score;
            }
        }
    });

    const percentages = {};
    Object.keys(domainScores).forEach(domain => {
        percentages[domain] = domainMax[domain] > 0
            ? Math.round((domainScores[domain] / domainMax[domain]) * 100)
            : 0;
    });
    return percentages;
};

const domainToCareer = {
    analytical: 'B.Tech / AI-ML Engineering',
    creativity: 'Multimedia & Design',
    leadership: 'Law / Public Policy',
    medical: 'MBBS / Healthcare',
    business: 'Business / BBA-MBA',
};

const explanations = {
    analytical: 'You have a strong analytical mind. You excel at problem-solving, logical reasoning, and data-based thinking. Engineering, AI/ML, and Computer Science are ideal paths for you.',
    creativity: 'Your creative vision sets you apart. You think outside the box and have a natural flair for visual and artistic expression. Multimedia, UX/UI Design, or Film would be great fits.',
    leadership: 'You naturally take charge and bring people together. You are comfortable with debate, strategy, and governance. Law, Policy, or MBA in Strategy would channel your strengths.',
    medical: 'You are drawn to helping others and have a strong science foundation. Your empathy and precision make you an excellent fit for MBBS, Pharmacy, or Biomedical Science.',
    business: 'You think like an entrepreneur. Markets, strategy, and human psychology fascinate you. BBA/MBA, Finance, or starting your own venture would be your best arena.',
};

// Submit assessment answers
const submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ success: false, message: 'Answers required' });
        }

        const scores = scoreDomains(answers);
        const topDomain = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const topCareer = domainToCareer[topDomain];
        const explanation = explanations[topDomain];

        // Insert result (SQLite — no ON CONFLICT needed, just insert fresh)
        await pool.query(
            `INSERT INTO assessment_results (user_id, scores, top_domain, explanation)
             VALUES ($1, $2, $3, $4)`,
            [req.user.id, JSON.stringify(scores), topCareer, explanation]
        );

        res.json({
            success: true,
            scores,
            top_domain: topCareer,
            explanation,
            domain_key: topDomain,
        });
    } catch (err) {
        console.error('Assessment submit error:', err);
        res.status(500).json({ success: false, message: 'Server error during assessment' });
    }
};

module.exports = { getQuestions, submitAssessment };

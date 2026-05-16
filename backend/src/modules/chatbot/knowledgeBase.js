// Curated career knowledge base for RAG-style chatbot
// Supports English (en) and Telugu (te) responses
const knowledgeBase = {
    en: {
        greetings: [
            "Hello! I'm LakshyaBot 🎓 — your AI career guide. Ask me anything about engineering, medicine, law, business, or design careers!",
        ],
        topics: [
            {
                keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'data science', 'tech', 'engineering', 'btech', 'b.tech', 'software'],
                response: `**AI/ML & Engineering Career Path** 🤖

**What it is:** AI/ML Engineering involves building intelligent systems — from recommendation engines to autonomous vehicles.

**Key Skills to Develop:**
- Python, Mathematics (Linear Algebra, Statistics)
- Machine Learning Libraries (TensorFlow, PyTorch, scikit-learn)
- Data Engineering & Cloud (AWS, GCP)

**Top Entrance Exams:** JEE Main, JEE Advanced, BITSAT, VITEEE

**Career Options:** AI Engineer, Data Scientist, ML Researcher, Robotics Engineer, Backend Developer

**Salary Range:** ₹8–50 LPA (fresher to senior)

**Best Colleges:** IITs, NITs, BITS Pilani, IIIT Hyderabad

**My Advice:** Start coding NOW — platforms like LeetCode (DSA), Kaggle (ML), and GitHub (projects) will transform your profile!`,
            },
            {
                keywords: ['mbbs', 'doctor', 'medical', 'neet', 'medicine', 'hospital', 'healthcare', 'biology'],
                response: `**MBBS / Medical Career Path** 🏥

**What it is:** MBBS is the gateway to becoming a doctor. After MBBS, you can specialize through MD/MS programs.

**Key Subjects:** Biology, Chemistry, Physics (PCB stream required)

**Entrance Exam:** NEET-UG (National Eligibility cum Entrance Test)
- Scoring 600+ in NEET gives access to government medical colleges.

**Career Options:** General Physician, Surgeon, Cardiologist, Psychiatrist, Medical Researcher

**Duration:** 5.5 years (MBBS) + 1 year internship + 3 years MD/MS

**Salary Range:** ₹5–30 LPA (varies greatly with specialization)

**Best Colleges:** AIIMS Delhi, JIPMER, CMC Vellore, Osmania Medical College

**My Advice:** NEET UG requires disciplined daily study — NCERT Biology is your Bible! Start with previous year papers.`,
            },
            {
                keywords: ['law', 'clat', 'lawyer', 'advocate', 'legal', 'llb', 'barrister', 'judge', 'court'],
                response: `**Law / Legal Career Path** ⚖️

**What it is:** Law graduates argue cases in courts, advise corporations, work in policy, or serve as judges.

**Key Entrance Exam:** CLAT (Common Law Admission Test) for NLUs
- Also: AILET (NLU Delhi), LSAT India, State law entrance exams

**Degree Options:**
- 5-year BA LLB (after 12th)
- 3-year LLB (after graduation)

**Career Options:** Corporate Lawyer, Criminal Advocate, IPR Attorney, Public Prosecutor, Judicial Services, Law Clerk

**Salary Range:** ₹4–40 LPA (varies — top lawyers earn crores!)

**Best Colleges:** NLSIU Bangalore (NLAT/CLAT rank 1), NLU Delhi, NALSAR Hyderabad

**My Advice:** Read newspapers daily. GK and legal reasoning are critical for CLAT. Join your school's debate team!`,
            },
            {
                keywords: ['business', 'mba', 'bba', 'management', 'entrepreneur', 'cat', 'marketing', 'finance', 'startup'],
                response: `**Business / MBA Career Path** 💼

**What it is:** Business education prepares you to lead organizations, manage finances, launch startups, and drive strategy.

**Pathway:**
- BBA (3 years after 12th) → MBA (2 years, post graduation)
- OR B.Tech/B.Sc + MBA (the most powerful combo!)

**Key Entrance Exams:**
- BBA: IPU CET, DUJAT, NMIMS CET, SET Symbiosis
- MBA: CAT, XAT, SNAP, GMAT (for abroad)

**Career Options:** Management Consultant, Investment Banker, Marketing Manager, Entrepreneur, Product Manager

**Salary Range:** ₹6–80 LPA (MBA from IIM can start at 25–30 LPA!)

**Best Colleges:** IIM A/B/C, XLRI, FMS Delhi, SP Jain

**My Advice:** Build real-world experience — internships, case competitions, and startup projects matter a LOT in MBA admissions!`,
            },
            {
                keywords: ['design', 'creative', 'multimedia', 'art', 'ux', 'ui', 'animation', 'film', 'fashion', 'nid', 'nift'],
                response: `**Multimedia & Design Career Path** 🎨

**What it is:** Design careers span UI/UX, brand identity, film, animation, fashion, and industrial design.

**Key Entrance Exams:** NID DAT, UCEED (IITs), CEED (PG), NIFT Entrance, MIT ID

**Degree Options:**
- B.Des from NID/IITs/MIT
- B.Sc Multimedia
- B.Com Fashion Merchandising (NIFT)

**Career Options:** UI/UX Designer, Brand Designer, Motion Graphic Artist, Film Director, Fashion Designer, Interior Architect

**Salary Range:** ₹4–25 LPA (senior creative directors can earn much more freelancing)

**Best Colleges:** NID Ahmedabad, IIT Bombay IDC, NIFT Delhi, Srishti Institute, MIT Pune

**My Advice:** Your PORTFOLIO is everything. Start creating on Figma, Adobe XD, or Canva. Post your work on Behance and Dribbble today!`,
            },
            {
                keywords: ['scholarship', 'money', 'fees', 'fund', 'financial', 'cost', 'expensive'],
                response: `**Scholarships & Financial Support** 💰

Several government and private scholarships can support your education:

**Government Scholarships:**
- INSPIRE Scholarship (DST) — ₹80,000/year for science students
- National Merit Scholarship — for 10+2 meritorious students
- PM Scholarships — for children of ex-servicemen

**State Scholarships (Telangana/AP):**
- TS Epass, AP Epass — full fee waiver for BC/SC/ST students

**Private Scholarships:**
- Tata Trust Scholarships
- Reliance Foundation Scholarship
- Wipro Cares Scholarship for STEM

**My Advice:** Apply to multiple scholarships simultaneously. Deadlines are usually April–June each year. Keep your marksheets and income certificates ready!`,
            },
            {
                keywords: ['abroad', 'international', 'usa', 'uk', 'canada', 'gre', 'sat', 'ielts', 'toefl', 'foreign'],
                response: `**Studying Abroad** 🌍

**Popular Destinations:** USA, UK, Canada, Germany, Australia

**Key Tests Required:**
- SAT (Undergrad in USA)
- GRE (Masters in USA/UK)
- GMAT (MBA abroad)
- IELTS/TOEFL (English proficiency)

**Top Universities:** MIT, Stanford, Oxford, Cambridge, University of Toronto, TU Munich

**Average Costs:** ₹30–80 Lakhs total (tuition + living). Scholarships like Fulbright, Chevening, and DAAD can cover significant costs.

**My Advice:** Maintain a 90%+ grade throughout school. Get strong extracurriculars, letters of recommendation, and a compelling Statement of Purpose!`,
            },
        ],
        fallback: `I'm here to help with career guidance! 🎓 You can ask me about:
- **Engineering & Tech** (AI/ML, CS, ECE)
- **Medical careers** (MBBS, NEET prep)
- **Law** (CLAT, NLU colleges)
- **Business** (BBA/MBA, CAT prep)
- **Design** (NID, NIFT, UX careers)
- **Scholarships and financial support**
- **Studying abroad**

What would you like to know?`,
    },

    te: {
        greetings: [
            "నమస్కారం! నేను LakshyaBot 🎓 — మీ AI కెరీర్ గైడ్. ఇంజినీరింగ్, మెడిసిన్, లా, బిజినెస్ లేదా డిజైన్ కెరీర్ గురించి ఏదైనా అడగండి!",
        ],
        topics: [
            {
                keywords: ['ai', 'engineering', 'btech', 'machinelearning', 'tech', 'software'],
                response: `**AI/ML & ఇంజినీరింగ్ కెరీర్** 🤖

**అంటే ఏమిటి:** AI/ML ఇంజినీరింగ్ అంటే తెలివైన సిస్టమ్లను నిర్మించడం — recommendation engines నుండి self-driving cars వరకు.

**ముఖ్యమైన నైపుణ్యాలు:**
- Python, Mathematics, Statistics
- TensorFlow, PyTorch, scikit-learn
- Cloud Computing (AWS, GCP)

**ప్రవేశ పరీక్షలు:** JEE Main, JEE Advanced, BITSAT, VITEEE

**కెరీర్ అవకాశాలు:** AI Engineer, Data Scientist, ML Researcher, Software Developer

**జీతం:** ₹8–50 LPA (fresher నుండి senior వరకు)

**ఉత్తమ కళాశాలలు:** IITs, NITs, BITS పిలాని, IIIT హైదరాబాద్

**నా సలహా:** ఇప్పుడే కోడింగ్ నేర్చుకోండి — LeetCode, Kaggle వంటి platforms మీ profile ను మార్చగలవు!`,
            },
            {
                keywords: ['mbbs', 'doctor', 'neet', 'medical', 'hospital', 'medicine', 'biology'],
                response: `**MBBS / వైద్య కెరీర్** 🏥

**అంటే ఏమిటి:** MBBS అనేది డాక్టర్ అవ్వడానికి ముఖ్యమైన మొదటి అడుగు.

**అవసరమైన సబ్జెక్టులు:** Biology, Chemistry, Physics (BiPC stream తప్పనిసరి)

**ప్రవేశ పరీక్ష:** NEET-UG
- 600+ స్కోర్ వస్తే ప్రభుత్వ మెడికల్ కళాశాలకు అర్హత.

**కెరీర్ అవకాశాలు:** General Physician, Surgeon, Cardiologist, Psychiatrist

**వ్యవధి:** MBBS 5.5 సంవత్సరాలు + 1 సంవత్సరం internship + MD/MS 3 సంవత్సరాలు

**జీతం:** ₹5–30 LPA (specialization ప్రకారం)

**ఉత్తమ కళాశాలలు:** AIIMS Delhi, JIPMER, CMC వేల్లూర్, ఉస్మానియా మెడికల్ కళాశాల

**నా సలహా:** NCERT Biology మీ Bibleగా చదవండి! రోజూ 6–8 గంటలు చదవడం తప్పనిసరి.`,
            },
            {
                keywords: ['business', 'mba', 'bba', 'management', 'entrepreneur', 'cat', 'startup'],
                response: `**Business / MBA కెరీర్** 💼

**అంటే ఏమిటి:** Business education మీకు organizations ని నిర్వహించడం, startups ప్రారంభించడం నేర్పిస్తుంది.

**Pathway:**
- BBA (12వ తర్వాత 3 సంవత్సరాలు) → MBA (2 సంవత్సరాలు)

**ప్రవేశ పరీక్షలు:**
- BBA: IPU CET, NMIMS CET
- MBA: CAT, XAT, SNAP

**కెరీర్ అవకాశాలు:** Management Consultant, Entrepreneur, Marketing Manager, Product Manager

**జీతం:** ₹6–80 LPA (IIM MBA నుండి 25–30 LPA మొదలవుతుంది!)

**ఉత్తమ కళాశాలలు:** IIM A/B/C, XLRI, FMS Delhi

**నా సలహా:** Internships మరియు case competitions లో participate చేయండి — MBA admissions లో చాలా ముఖ్యం!`,
            },
            {
                keywords: ['design', 'creative', 'art', 'multimedia', 'ux', 'ui', 'animation', 'nid'],
                response: `**Multimedia & Design కెరీర్** 🎨

**అంటే ఏమిటి:** Design careers లో UI/UX, brand identity, film, animation, fashion design ఉంటాయి.

**ప్రవేశ పరీక్షలు:** NID DAT, UCEED, CEED, NIFT Entrance

**కెరీర్ అవకాశాలు:** UI/UX Designer, Motion Graphic Artist, Film Director, Fashion Designer

**జీతం:** ₹4–25 LPA

**ఉత్తమ కళాశాలలు:** NID అహ్మదాబాద్, IIT Bombay IDC, NIFT Delhi

**నా సలహా:** మీ Portfolio చాలా important! Figma లో designs చేయడం మొదలుపెట్టండి, Behance లో post చేయండి!`,
            },
        ],
        fallback: `నేను మీకు కెరీర్ గైడెన్స్ లో సహాయపడగలను! 🎓 మీరు ఇవి అడగవచ్చు:
- **ఇంజినీరింగ్ & టెక్** (AI/ML, CS)
- **వైద్య కెరీర్** (MBBS, NEET)
- **లా** (CLAT, NLU కళాశాలలు)
- **బిజినెస్** (BBA/MBA, CAT)
- **డిజైన్** (NID, NIFT, UX)

మీకు ఏ గురించి తెలుసుకోవాలి?`,
    },
    parent: {
        intro: (domain) => `**Parent Explanation: ${domain}**\n\nDear Parent, your child has shown strong aptitude for **${domain}**. Here's why this is an excellent choice:\n\n`,
        suffix: `\n\n**Financial Security:** This career path provides excellent job security and competitive salaries in a growing industry.\n\n**Respected Profession:** Completely socially respected with clear progression opportunities.\n\n**Our Recommendation:** Support your child's passion — it's the strongest predictor of success! 🙏`,
    },
};

module.exports = knowledgeBase;

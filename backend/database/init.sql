-- Lakshyamaarg SQLite Schema
-- Runs automatically on first server start — no manual setup needed!

CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    phone       TEXT,
    password    TEXT NOT NULL,
    education_level TEXT,
    stream      TEXT,
    otp         TEXT,
    otp_verified INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assessment_results (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    scores      TEXT NOT NULL,
    top_domain  TEXT NOT NULL,
    explanation TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS opportunities (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               TEXT NOT NULL,
    type                TEXT NOT NULL,
    domain              TEXT NOT NULL,
    organizer           TEXT,
    description         TEXT,
    eligibility         TEXT,
    stipend             TEXT,
    prize               TEXT,
    deadline            TEXT,
    registration_link   TEXT,
    created_at          TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chatbot_sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    message     TEXT NOT NULL,
    response    TEXT NOT NULL,
    language    TEXT DEFAULT 'en',
    created_at  TEXT DEFAULT (datetime('now'))
);

-- ─── Seed opportunities ───────────────────────────────────────────────────────
INSERT OR IGNORE INTO opportunities (id, title, type, domain, organizer, description, eligibility, stipend, prize, deadline, registration_link) VALUES
(1,  'IIT Bombay Summer Research Internship', 'internship', 'technology',
     'IIT Bombay', 'Work with top IIT professors on AI and ML research projects for 8 weeks.',
     'B.Tech/B.E. students, 2nd year and above, CGPA 7.5+', 'Rs. 15,000/month', NULL,
     '2025-04-30', 'https://www.iitb.ac.in/internship'),

(2,  'Smart India Hackathon 2025', 'hackathon', 'technology',
     'Ministry of Education, Govt of India', 'National hackathon to solve real government problems using technology and innovation.',
     'All college students (UG & PG)', NULL, 'Rs. 1,00,000 per team',
     '2025-06-15', 'https://sih.gov.in'),

(3,  'National Merit Scholarship Scheme', 'scholarship', 'general',
     'Ministry of Education', 'Merit-based scholarship for outstanding students in Class XI and XII.',
     'Class XI students with 80%+ in Class X', 'Rs. 12,000/year', NULL,
     '2025-09-30', 'https://scholarships.gov.in'),

(4,  'AIIMS Summer Student Research Programme', 'internship', 'medical',
     'AIIMS New Delhi', 'Hands-on research experience in clinical and basic medical sciences.',
     'MBBS students in 1st or 2nd year', 'Rs. 10,000/month', NULL,
     '2025-03-31', 'https://www.aiims.edu/ssp'),

(5,  'Unilever Future Leaders Program', 'internship', 'business',
     'Hindustan Unilever Limited', 'Premium paid internship in FMCG management across sales, marketing, and supply chain.',
     'MBA students/Final year BBA/B.Com', 'Rs. 50,000/month', NULL,
     '2025-05-15', 'https://careers.hul.co.in'),

(6,  'Adobe India Design Challenge', 'hackathon', 'design',
     'Adobe India', 'National UI/UX and graphic design competition. Solve real creative briefs using Adobe tools.',
     'Students enrolled in any design or engineering degree', NULL, 'Rs. 3,00,000 in prizes',
     '2025-07-01', 'https://adobe.com/india/design-challenge'),

(7,  'PM Scholarship for CAPF Personnel', 'scholarship', 'general',
     'Ministry of Home Affairs', 'Scholarship for wards of CAPF/RPF personnel for professional degree courses.',
     'Wards of CAPF/RPF personnel, pursuing technical/professional degrees', 'Rs. 36,000/year', NULL,
     '2025-10-31', 'https://scholarships.gov.in'),

(8,  'Google Summer of Code 2025', 'internship', 'technology',
     'Google', 'Global program connecting students with open source organizations for coding projects.',
     'Students 18+ enrolled in accredited institution', 'USD 1,500 - 6,600', NULL,
     '2025-04-08', 'https://summerofcode.withgoogle.com'),

(9,  'Tata Crucible Campus Quiz', 'hackathon', 'business',
     'Tata Group', 'Premier business quiz for college students covering current affairs, economics, and corporate world.',
     'Students from any stream in any UG/PG program', NULL, 'Rs. 2,00,000 in prizes',
     '2025-08-20', 'https://tatacrucible.com'),

(10, 'INSA Summer Research Fellowship', 'internship', 'medical',
     'Indian National Science Academy', 'Research fellowship in life sciences, chemistry, and physical sciences.',
     'Students pursuing B.Sc/M.Sc with 60%+ marks', 'Rs. 10,000/month', NULL,
     '2025-03-15', 'https://insaindia.res.in'),

(11, 'NID Design Talent Scholarship', 'scholarship', 'design',
     'National Institute of Design', 'Scholarship for underprivileged students in design programs across India.',
     'Students in UG design programs, annual family income < Rs. 4.5 lakh', 'Rs. 40,000/year', NULL,
     '2025-11-30', 'https://www.nid.edu/scholarships'),

(12, 'Microsoft Imagine Cup 2025', 'hackathon', 'technology',
     'Microsoft India', 'Global student technology competition. Build AI-powered solutions for real-world problems.',
     'Students enrolled in a college/university, team of 1-3', NULL, 'USD 85,000 grand prize',
     '2025-05-30', 'https://imaginecup.microsoft.com'),

(13, 'ICICI Lombard Legal Internship', 'internship', 'law',
     'ICICI Lombard General Insurance', 'Internship in corporate legal, compliance, and regulatory affairs.',
     'LLB/LLM students in penultimate or final year', 'Rs. 20,000/month', NULL,
     '2025-04-20', 'https://www.icicilombard.com/careers'),

(14, 'Reliance Foundation Scholarship', 'scholarship', 'general',
     'Reliance Foundation', 'Merit-cum-means scholarship for UG students in technology and management fields.',
     'UG 1st year students, family income < Rs. 2.5 lakh, JEE/CLAT rank holders', 'Rs. 4,00,000 over 4 years', NULL,
     '2025-07-15', 'https://scholarships.reliancefoundation.org'),

(15, 'Bar Council All India Law Moot Court', 'hackathon', 'law',
     'Bar Council of India', 'National moot court competition for law students on constitutional and human rights topics.',
     'LLB students from any recognized law college', NULL, 'Trophy + Certificate + Rs. 50,000',
     '2025-09-10', 'https://barcouncilofindia.org/mootcourt');

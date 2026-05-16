# ⚡ Lakshyamaarg — AI Career Intelligence Platform

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL installed and running

### 1. Database Setup
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE lakshyamaarg;"

# Run schema + seed data
psql -U postgres -d lakshyamaarg -f backend/database/init.sql
```

### 2. Backend
```bash
cd backend
# Edit .env if your PostgreSQL credentials differ from defaults
npm start
# → Running on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm run dev
# → Opens at http://localhost:5173
```

---

## Environment Variables (`backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_NAME` | lakshyamaarg | Database name |
| `DB_USER` | postgres | DB username |
| `DB_PASSWORD` | postgres | DB password |
| `JWT_SECRET` | (set) | JWT signing secret |
| `PORT` | 5000 | API server port |

---

## API Endpoints
| Module | Method | Route |
|---|---|---|
| Auth | POST | `/api/auth/register` |
| Auth | POST | `/api/auth/verify-otp` |
| Auth | POST | `/api/auth/login` |
| Auth | GET | `/api/auth/me` |
| Psychometric | GET | `/api/psychometric/questions` |
| Psychometric | POST | `/api/psychometric/submit` |
| Recommendation | GET | `/api/recommendation/my` |
| Recommendation | GET | `/api/recommendation/roadmap/:key` |
| Chatbot | POST | `/api/chatbot/message` |
| Opportunities | GET | `/api/opportunities` |

---

## Features
- 🧠 20-question psychometric test with 5 domain scores
- 🗺️ Career roadmaps: AI/Tech, MBBS, Law, Business, Design
- 🤖 Bilingual chatbot (English + Telugu) with Parent Mode
- 🎯 15+ opportunities with domain filter + deadline countdown
- 🔐 JWT authentication with email OTP verification
- 📊 Dashboard with score analysis and career insights

> **Dev note:** In `NODE_ENV=development`, OTP is returned in the API response for testing.

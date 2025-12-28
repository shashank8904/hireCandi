# HireCandi - AI-Powered Resume Shortlisting Platform

An intelligent resume screening system that helps HR professionals shortlist candidates using rule-based scoring and AI-enhanced explanations.

## 🎯 Overview

HireCandi automatically:
- Parses resume PDFs
- Validates skills against actual work experience
- Scores candidates using intelligent algorithms
- Provides clear explanations for rankings
- Delivers ranked shortlists for efficient hiring

## 📁 Project Structure

\`\`\`
hireCandi/
├── backend/           # Node.js + Express backend API
│   ├── src/          # Source code
│   ├── package.json  # Dependencies
│   └── README.md     # Backend documentation
├── CHANGELOG.md      # Version history
└── UPDATE_SUMMARY.md # Recent changes
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB

### Setup

\`\`\`bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Start server
npm run dev
\`\`\`

Server runs at \`http://localhost:3000\`

## 📖 Documentation

- **[Backend Documentation](./backend/README.md)** - Complete backend API guide
- **[Skill Validation Guide](./backend/SKILL_VALIDATION_GUIDE.md)** - How skill matching works
- **[API Testing Guide](./backend/TEST_GUIDE.md)** - Test the API endpoints
- **[Implementation Details](./backend/IMPLEMENTATION_SUMMARY.md)** - Technical deep-dive
- **[Changelog](./CHANGELOG.md)** - Version history

## ✨ Key Features

### 🎯 Smart Skill Validation
Skills must be proven in actual work experience or projects, not just listed.

### 📊 Intelligent Scoring
- **50%** - Skill match (validated in work context)
- **30%** - Experience alignment
- **20%** - Role relevance

### 🔍 Clear Explanations
Each candidate gets:
- Matched skills (validated)
- Missing skills
- Strengths, gaps, and summary

### ⚡ Asynchronous Processing
Upload resumes → Processing happens in background → Get ranked results

## 🛠 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Multer + pdf-parse

## 📡 API Endpoints

\`\`\`
GET  /health                      # Health check
POST /api/jobs                    # Create job
POST /api/jobs/:jobId/resumes     # Upload resumes
GET  /api/jobs/:jobId/status      # Check status
GET  /api/jobs/:jobId/results     # Get ranked candidates
\`\`\`

## 🎓 Quick Example

\`\`\`bash
# 1. Create job
curl -X POST http://localhost:3000/api/jobs \\
  -H "Content-Type: application/json" \\
  -d '{"jdText": "Senior Node.js Developer..."}'

# 2. Upload resumes
curl -X POST http://localhost:3000/api/jobs/{jobId}/resumes \\
  -F "resumes=@resume1.pdf"

# 3. Get results
curl http://localhost:3000/api/jobs/{jobId}/results
\`\`\`

## 📊 Scoring System

- **75-100**: Strong match
- **50-74**: Moderate fit
- **25-49**: Limited match
- **0-24**: Minimal alignment

Skills are validated against actual work experience to prevent keyword stuffing.

## 📈 Roadmap

### Phase 1 (Complete) ✅
- Core API, Resume parsing, Rule-based scoring, Skill validation

### Phase 2 (Planned)
- AI-powered explanations, Enhanced insights

### Phase 3 (Planned)
- Authentication, Analytics dashboard, Notifications

## 🧪 Testing

\`\`\`bash
cd backend && ./test.sh
\`\`\`

## 📄 License

ISC

---

**Built for better hiring outcomes** | Version 1.1.0 | [Changelog](./CHANGELOG.md)

For detailed documentation, see [Backend README](./backend/README.md)

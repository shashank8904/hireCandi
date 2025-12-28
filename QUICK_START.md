# HireCandi - Quick Start Guide

## 🎉 Everything is Ready!

Both frontend and backend are connected and running.

---

## 🚀 Access the Application

### Frontend (UI)
```
http://localhost:5173
```
Open this URL in your browser to use the application.

### Backend (API)
```
http://localhost:3000
```
API is running and connected.

---

## ✅ Current Status

- ✅ **Backend**: Running on port 3000
- ✅ **Frontend**: Running on port 5173
- ✅ **MongoDB**: Connected
- ✅ **API**: Fully integrated
- ✅ **Proxy**: Configured and working

---

## 🎯 How to Use

### Step 1: Create a Job
1. Go to http://localhost:5173
2. Enter a job description (minimum 50 characters)
   - Example: "We need a Senior Backend Engineer with 5+ years in Node.js, Express, MongoDB, REST APIs, and system design."
3. Upload resume PDF files (1-50 files, max 5MB each)
4. Click "Submit"

### Step 2: Watch Processing
- You'll be redirected to the processing page
- Status updates every 3 seconds
- Progress bar shows completion
- Automatically redirects when done

### Step 3: View Results
- See ranked candidates in a table
- Candidates sorted by score (highest first)
- Color-coded fit badges:
  - 🟢 **Strong** (80-100)
  - 🟡 **Partial** (60-79)
  - 🔴 **Weak** (0-59)

### Step 4: View Details
- Click "View Details" on any candidate
- See complete breakdown:
  - Summary
  - Strengths
  - Gaps
  - Matched Skills
  - Missing Skills

---

## 📁 Project Structure

```
hireCandi/
├── backend/              # Node.js + Express API
│   ├── src/             # Source code
│   ├── uploads/         # Resume storage
│   └── package.json
│
├── frontend/            # React + Vite UI
│   ├── src/
│   │   ├── pages/      # CreateJob, Processing, Results
│   │   ├── components/ # CandidateDetailsModal
│   │   └── api/        # API helper
│   └── package.json
│
└── QUICK_START.md      # This file
```

---

## 🧪 Test with Sample Data

### Sample Job Description
```
Senior Backend Engineer

Requirements:
- 5+ years of experience in Node.js and Express
- Strong knowledge of MongoDB and NoSQL databases
- Experience with REST API design and implementation
- Proficiency in JavaScript/TypeScript
- Understanding of system design and scalability
- Experience with Docker and AWS is a plus
- Strong problem-solving and communication skills
```

### What to Test
1. ✅ Upload 2-3 PDF resumes
2. ✅ Watch processing in real-time
3. ✅ Check ranked results
4. ✅ View candidate details
5. ✅ Try different job descriptions

---

## 🔧 If Something Goes Wrong

### Frontend Not Loading?
```bash
# Check if running
curl http://localhost:5173

# Restart if needed
cd frontend && npm run dev
```

### Backend Not Responding?
```bash
# Check if running
curl http://localhost:3000/health

# Restart if needed
cd backend && npm run dev
```

### MongoDB Not Connected?
```bash
# Check MongoDB
ps aux | grep mongod

# Start MongoDB
mongod
# OR
brew services start mongodb-community
```

### API Calls Failing?
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify `.env` file exists in backend
4. Test API directly: `curl http://localhost:3000/health`

---

## 📊 What Happens Behind the Scenes

### 1. Job Creation
```
Frontend → POST /api/jobs → Backend
         ← { jobId } ←
```

### 2. Resume Upload
```
Frontend → POST /api/jobs/:jobId/resumes → Backend
         → Saves PDFs to uploads/
         → Creates Resume records
         → Starts background processing
         ← { success } ←
```

### 3. Processing
```
Backend → Parses PDFs
        → Extracts text
        → Identifies skills
        → Validates in work context
        → Calculates scores
        → Generates insights
        → Updates Resume records
```

### 4. Status Polling
```
Frontend → GET /api/jobs/:jobId/status (every 3s)
         ← { jobStatus, resumes: { total, completed, ... } }
         → Checks if jobStatus === "completed"
         → Auto-redirects to results
```

### 5. Results Display
```
Frontend → GET /api/jobs/:jobId/results
         ← { candidates: [ { name, finalScore, ... } ] }
         → Calculates fit labels
         → Displays in table
```

---

## 🎨 Features Implemented

### ✅ Frontend
- Job creation form with validation
- Multi-file PDF upload
- Real-time processing status
- Auto-refresh and auto-navigation
- Ranked results table
- Candidate details modal
- Responsive design
- Error handling
- Loading states

### ✅ Backend
- Job creation API
- Resume upload handling
- PDF text extraction
- Skill validation (context-based)
- Rule-based scoring
- Async background processing
- Status tracking
- Results ranking

---

## 📈 Scoring Algorithm

Your backend uses smart skill validation:

### Rule-Based Scoring (0-100)
- **50%** - Skill Match (validated in work context)
- **30%** - Experience Alignment
- **20%** - Role Relevance

### Skill Validation
Skills must be:
1. ✅ Listed in resume skills section
2. ✅ **AND** used in Experience or Projects

**Example:**
```
Resume claims: Node.js, Docker, AWS
Experience: "Built APIs with Node.js"
Result: Only Node.js counts ✅
Score: More accurate!
```

---

## 🎯 Ready to Test!

**Open the application:**
```
http://localhost:5173
```

**Create your first job and start shortlisting candidates!** 🚀

---

## 📖 Documentation

- **[Frontend Implementation](./frontend/FRONTEND_IMPLEMENTATION.md)** - Complete frontend details
- **[Backend README](./backend/README.md)** - Backend API documentation
- **[Skill Validation Guide](./backend/SKILL_VALIDATION_GUIDE.md)** - How scoring works
- **[Connection Status](./CONNECTION_STATUS.md)** - Integration details
- **[Running Guide](./RUNNING_GUIDE.md)** - Server management

---

## ✨ You're All Set!

Everything is connected and working. Start creating jobs and uploading resumes!

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:3000

Happy hiring with HireCandi! 🎉


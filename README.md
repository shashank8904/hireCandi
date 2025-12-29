# 🎯 HireCandi - Smart Resume Shortlisting Platform

> **Automate your resume screening process with intelligent candidate ranking**

HireCandi is a full-stack web application that helps HR professionals and recruiters quickly shortlist the best candidates from a pile of resumes. Simply paste a job description, upload resumes, and get ranked results with detailed insights!

---

## 🌟 What Does It Do?

Imagine you have 50 resumes to review for a single job posting. HireCandi:

1. **Reads** all resume PDFs automatically
2. **Analyzes** candidate skills and experience
3. **Scores** each candidate based on job requirements
4. **Ranks** candidates from best to worst fit
5. **Explains** why each candidate is a good (or bad) match

**Result:** Save hours of manual screening and make data-driven hiring decisions!

---

## ✨ Key Features

### 🔍 Smart Skill Validation
- Not just keyword matching - validates skills against actual work experience
- Prevents "resume keyword stuffing"
- Only counts skills proven in real projects

### 📊 Intelligent Scoring (0-100)
- **50%** Skill Match - Do they have the required skills?
- **30%** Experience Alignment - Do they have relevant experience?
- **20%** Role Relevance - Is their background a good fit?

### 🎨 Beautiful User Interface
- Clean, modern design with TailwindCSS
- Real-time processing updates
- Interactive candidate details
- Color-coded fit badges (Strong 🟢 / Partial 🟡 / Weak 🔴)

### ⚡ Fast & Efficient
- Bulk resume upload (up to 50 resumes)
- Background processing
- Real-time status updates
- Automatic ranking and sorting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HireCandi Platform                    │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│   🎨 FRONTEND        │   ⚙️ BACKEND                     │
│   React + Vite       │   Node.js + Express              │
│   Port: 5173         │   Port: 3000                     │
│                      │                                   │
│   - Job Creation     │   - Resume Parsing               │
│   - File Upload      │   - Skill Extraction             │
│   - Live Status      │   - Scoring Engine               │
│   - Results Table    │   - MongoDB Storage              │
│   - Details Modal    │   - REST API                     │
│                      │                                   │
└──────────────────────┴──────────────────────────────────┘
                       │
                       ▼
                 📦 MongoDB
                 (Data Storage)
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Terminal/Command Prompt** - Basic command line knowledge

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd hireCandi
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
echo "MONGODB_URI=mongodb://localhost:27017/hirecandi
PORT=3000" > .env

# Start the backend server
npm run dev
```

✅ Backend should now be running at `http://localhost:3000`

### Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173`

### Step 4: Start MongoDB

```bash
# For Mac (with Homebrew)
brew services start mongodb-community

# OR directly run
mongod

# For Windows
net start MongoDB

# For Linux
sudo systemctl start mongod
```

---

## 🎮 How to Use

### 1️⃣ Create a Job

- Open `http://localhost:5173` in your browser
- Enter a detailed job description (minimum 50 characters)
- Example:
  ```
  We are looking for a Senior Backend Developer with 5+ years 
  of experience in Node.js, Express, MongoDB, REST APIs, and 
  microservices architecture. Strong problem-solving skills required.
  ```

### 2️⃣ Upload Resumes

- Click "Choose Files" or drag-and-drop
- Upload 1-50 PDF resumes (max 5MB each)
- Click "Submit"

### 3️⃣ Watch the Magic

- You'll see a processing page with live updates
- Progress bar shows completion status
- Updates every 3 seconds automatically
- Auto-redirects when processing is complete

### 4️⃣ View Results

- Candidates are ranked by score (highest first)
- See at a glance:
  - **Name** - Candidate's name
  - **Score** - Overall match (0-100)
  - **Fit Level** - Strong 🟢 / Partial 🟡 / Weak 🔴
  - **Actions** - View detailed breakdown

### 5️⃣ Explore Details

Click "View Details" on any candidate to see:
- ✅ **Matched Skills** - Skills they have that you need
- ❌ **Missing Skills** - Required skills they lack
- 💪 **Strengths** - What makes them a good fit
- 📉 **Gaps** - Areas where they fall short
- 📝 **Summary** - Overall assessment

---

## 📁 Project Structure

```
hireCandi/
│
├── 📂 backend/                    # Server-side application
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── server.js              # Server entry point
│   │   ├── controllers/           # Request handlers
│   │   │   └── job.controller.js  # Job-related logic
│   │   ├── models/                # Database schemas
│   │   │   ├── Job.js             # Job model
│   │   │   └── Resume.js          # Resume model
│   │   ├── routes/                # API routes
│   │   │   └── job.routes.js      # Job endpoints
│   │   ├── services/              # Business logic
│   │   │   ├── resumeParser.js    # PDF parsing
│   │   │   ├── scoringEngine.js   # Scoring algorithm
│   │   │   └── processor.js       # Background processing
│   │   └── utils/                 # Helper functions
│   │       └── textCleaner.js     # Text processing
│   ├── uploads/                   # Uploaded resume files
│   └── package.json               # Backend dependencies
│
├── 📂 frontend/                   # Client-side application
│   ├── src/
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # Main app component
│   │   ├── pages/                 # Page components
│   │   │   ├── CreateJobPage.jsx  # Job creation form
│   │   │   ├── ProcessingPage.jsx # Status tracking
│   │   │   └── ResultsPage.jsx    # Results display
│   │   ├── components/            # Reusable components
│   │   │   └── CandidateDetailsModal.jsx
│   │   └── api/                   # API helper
│   │       └── api.js             # Backend communication
│   ├── index.html                 # HTML template
│   └── package.json               # Frontend dependencies
│
├── 📄 README.md                   # This file!
├── 📄 QUICK_START.md              # Detailed setup guide
└── 📄 RUNNING_GUIDE.md            # Server management tips
```

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if server is running |
| `POST` | `/api/jobs` | Create a new job |
| `POST` | `/api/jobs/:jobId/resumes` | Upload resumes for a job |
| `GET` | `/api/jobs/:jobId/status` | Get processing status |
| `GET` | `/api/jobs/:jobId/results` | Get ranked candidates |

---

## 🧪 Testing

### Test the Backend API

```bash
cd backend
./test.sh
```

### Test with Sample Data

1. Use the sample job description from `QUICK_START.md`
2. Upload sample resumes from the `uploads/` folder (if any)
3. Check the results and scoring

---

## 📊 How Scoring Works

### Skill Validation (Smart!)

HireCandi doesn't just look for keywords. It validates skills by checking if they're actually used in work experience:

**Example:**

```
❌ Bad Resume: Lists "Docker, AWS, Kubernetes" but never mentions them in experience

✅ Good Resume: Lists "Docker" AND has "Deployed microservices using Docker containers"
                → Only Docker counts as validated!
```

### Score Breakdown

```
Final Score (0-100) = 
  50% × Skill Match Score +
  30% × Experience Score +
  20% × Role Relevance Score
```

### Fit Categories

- **🟢 Strong Match (80-100)** - Highly qualified, interview immediately
- **🟡 Partial Match (60-79)** - Decent fit, worth considering
- **🔴 Weak Match (0-59)** - Not a good fit for this role

---

## 🐛 Troubleshooting

### Frontend not loading?

```bash
# Check if Vite is running
curl http://localhost:5173

# Restart frontend
cd frontend
npm run dev
```

### Backend not responding?

```bash
# Check if Express is running
curl http://localhost:3000/health

# Restart backend
cd backend
npm run dev
```

### MongoDB connection error?

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod
# OR
brew services start mongodb-community
```

### Uploads not working?

- Check file size (max 5MB per file)
- Ensure files are PDF format
- Check backend `uploads/` folder permissions

---

## 📈 Future Enhancements

- [ ] User authentication & authorization
- [ ] Save and export reports
- [ ] Email notifications
- [ ] Interview scheduling
- [ ] Analytics dashboard
- [ ] AI-powered job description generation
- [ ] Multi-language resume support
- [ ] Integration with ATS systems

---

## 📚 Documentation

For more detailed information:

- **[QUICK_START.md](./QUICK_START.md)** - Comprehensive setup guide
- **[Backend README](./backend/README.md)** - Backend API details
- **[Frontend Implementation](./frontend/FRONTEND_IMPLEMENTATION.md)** - Frontend architecture
- **[Skill Validation Guide](./backend/SKILL_VALIDATION_GUIDE.md)** - Scoring algorithm deep-dive

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

ISC License - Feel free to use this project for your needs.

---

## 🎉 Quick Links

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## 💡 Pro Tips

1. **Better Job Descriptions = Better Results** - Be specific about required skills
2. **Use Consistent Formats** - Resumes with clear sections work best
3. **Review Top 5-10 Candidates** - The top matches are usually the best
4. **Check "View Details"** - Understand why candidates scored high or low
5. **Iterate** - Try different job descriptions to fine-tune results

---

<div align="center">

### ⭐ Made with ❤️ for Better Hiring Outcomes



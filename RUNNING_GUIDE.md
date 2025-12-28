# HireCandi - Running Guide

## 🚀 Quick Start

Both backend and frontend are now running!

---

## 📍 Server URLs

### Backend API
```
http://localhost:3000
```
- Health Check: http://localhost:3000/health
- API Base: http://localhost:3000/api

### Frontend Application
```
http://localhost:5173
```
- Open in browser: http://localhost:5173

---

## ✅ Current Status

### Backend Server ✅
- **Port**: 3000
- **Status**: Running
- **MongoDB**: Connected
- **Environment**: Development
- **Auto-reload**: Enabled (nodemon)

### Frontend Server ✅
- **Port**: 5173
- **Status**: Running
- **Framework**: React + Vite
- **Proxy**: API calls to localhost:3000
- **Hot Reload**: Enabled

---

## 🎯 How to Use

### 1. Open the Application
```
Open your browser: http://localhost:5173
```

### 2. Create a Job
- Enter job description (minimum 50 characters)
- Click "Create Job"
- You'll get a Job ID

### 3. Upload Resumes
- Upload PDF resume files (max 50 files, 5MB each)
- Click "Upload Resumes"
- Processing starts automatically in background

### 4. View Results
- Check processing status
- View ranked candidates
- See scores, matched skills, strengths, and gaps

---

## 🛠 Development Commands

### Backend (Terminal 1)
```bash
cd backend
npm run dev    # Start with auto-reload
npm start      # Production mode
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
```

---

## 🔄 Restart Servers

### If Backend Stops
```bash
cd backend
npm run dev
```

### If Frontend Stops
```bash
cd frontend
npm run dev
```

### Restart Both
```bash
# Kill all processes
pkill -f nodemon
pkill -f vite

# Start backend
cd backend && npm run dev &

# Start frontend
cd frontend && npm run dev &
```

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Job
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"jdText": "Senior Node.js Developer with 5+ years experience..."}'
```

### Upload Resumes
```bash
curl -X POST http://localhost:3000/api/jobs/{jobId}/resumes \
  -F "resumes=@/path/to/resume.pdf"
```

---

## 📊 Project Structure

```
hireCandi/
├── backend/              # Node.js + Express API
│   ├── src/             # Source code
│   ├── uploads/         # Uploaded resumes
│   └── package.json
│
├── frontend/            # React + Vite UI
│   ├── src/            # React components
│   └── package.json
│
└── RUNNING_GUIDE.md    # This file
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Restart
cd backend && npm run dev
```

**Frontend (Port 5173):**
```bash
# Find process
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:5173)

# Restart
cd frontend && npm run dev
```

### MongoDB Not Connected

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB (if using Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

### Cannot Access Frontend

1. Check if server is running: `curl http://localhost:5173`
2. Check browser console for errors
3. Verify API proxy in `frontend/vite.config.js`

### API Calls Failing

1. Check backend is running: `curl http://localhost:3000/health`
2. Check MongoDB connection in backend logs
3. Verify `.env` file in backend directory

---

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hirecandi
NODE_ENV=development
```

### Frontend (vite.config.js)
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

---

## 🎨 Features Available

### ✅ Working Features
- Job creation with JD
- Multiple PDF resume upload
- Automatic resume parsing
- Rule-based scoring with skill validation
- Ranked candidate results
- Strengths, gaps, and summaries
- Real-time processing status

### 🔜 Coming Soon
- AI-powered explanations
- Enhanced summaries
- Analytics dashboard
- Email notifications

---

## 📖 Documentation

- **[Backend README](./backend/README.md)** - API documentation
- **[Frontend README](./frontend/README.md)** - UI documentation
- **[Skill Validation Guide](./backend/SKILL_VALIDATION_GUIDE.md)** - How scoring works
- **[API Testing Guide](./backend/TEST_GUIDE.md)** - Test endpoints

---

## 🎯 Quick Test Flow

1. **Open**: http://localhost:5173
2. **Create Job**: Enter job description
3. **Upload**: Select PDF resumes
4. **Wait**: Processing happens in background
5. **View**: See ranked candidates with scores

---

## 💡 Tips

### For Development
- Backend auto-reloads on file changes (nodemon)
- Frontend hot-reloads on save (Vite HMR)
- Check terminal logs for errors
- Use browser DevTools for frontend debugging

### For Testing
- Use test PDFs with varied skills
- Try different job descriptions
- Test with 1-50 resumes
- Check processing status endpoint

### For Production
- Build frontend: `cd frontend && npm run build`
- Serve static files from backend
- Use environment variables for config
- Set up proper MongoDB instance
- Enable CORS if needed

---

## 🚀 You're All Set!

**Backend**: http://localhost:3000  
**Frontend**: http://localhost:5173

Start creating jobs and uploading resumes! 🎉

---

**Need help?** Check the documentation in `backend/` and `frontend/` folders.


# Changelog

All notable changes to HireCandi backend will be documented in this file.

## [1.1.0] - 2025-12-25

### 🎯 Enhanced Skill Validation

#### Added
- **Context-based skill validation**: Skills must now appear in Experience or Projects sections
- Section extraction utility for Experience, Projects, Skills, and Education
- `experienceText` and `projectsText` fields in Resume model's parsedData
- Smart skill matching that prevents false positives from keyword stuffing

#### Changed
- **Scoring algorithm enhancement**: Skill match score now validates skills against actual work context
- `calculateSkillScore()` now accepts experienceText and projectsText parameters
- Resume parser extracts and stores section-specific text
- Matched skills are only counted if they appear in work context

#### Impact
- **More accurate candidate rankings**: Eliminates inflated scores from resume keyword padding
- **Better quality shortlisting**: Only candidates with proven skills rank highly
- **HR-friendly**: More reliable results with validated skills

#### Technical Details
```javascript
// Old Logic
Skill in resume skills list = MATCH ✅

// New Logic
Skill in resume skills list + Skill used in Experience/Projects = MATCH ✅
Skill in resume skills list only = NO MATCH ❌
```

#### Files Modified
- `src/utils/textCleaner.js` - Added extractSection() function
- `src/services/resumeParser.js` - Extract and store experience/projects text
- `src/services/scoringEngine.js` - Enhanced skill validation logic
- `src/models/Resume.js` - Added experienceText and projectsText fields

---

## [1.0.0] - 2025-12-25

### 🚀 Initial MVP Release

#### Added
- Express.js REST API server
- MongoDB integration with Mongoose
- Job creation and management
- Multi-resume PDF upload (max 50 files, 5MB each)
- Asynchronous resume processing
- PDF text extraction and parsing
- Rule-based scoring engine:
  - Skill match (50%)
  - Experience alignment (30%)
  - Role relevance (20%)
- Automatic extraction of:
  - Name, email, phone
  - Skills (60+ tech keywords)
  - Years of experience
  - Education qualifications
- Auto-generated candidate insights:
  - Strengths
  - Gaps
  - Summary
  - Matched/Missing skills
- Ranked results API endpoint

#### Technical Stack
- Node.js + Express.js
- MongoDB + Mongoose
- Multer for file uploads
- pdf-parse for PDF extraction
- Async processing with setImmediate

#### API Endpoints
- `GET /health` - Health check
- `POST /api/jobs` - Create job
- `POST /api/jobs/:jobId/resumes` - Upload resumes
- `GET /api/jobs/:jobId/status` - Check processing status
- `GET /api/jobs/:jobId/results` - Get ranked candidates

#### Architecture
- Service-based structure
- Background processing
- Individual resume error isolation
- Production-ready error handling
- Clean, maintainable code

#### Documentation
- Complete README with setup instructions
- API testing guide
- Implementation summary
- Automated test script

---

## Version Format

- **Major.Minor.Patch** (Semantic Versioning)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)


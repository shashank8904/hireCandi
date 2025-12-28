# HireCandi API Testing Guide

## Base URL
```
http://localhost:3000
```

## Testing Flow

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Create a Job
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "jdText": "We are looking for a Senior Backend Engineer with 5+ years of experience in Node.js, Express, MongoDB, and REST APIs. Strong knowledge of JavaScript, TypeScript, Docker, and AWS required. Experience with microservices architecture is a plus."
  }'
```

**Response:**
```json
{
  "success": true,
  "jobId": "...",
  "status": "created",
  "createdAt": "..."
}
```

**Save the `jobId` for next steps!**

### 3. Upload Resume PDFs

```bash
# Single file
curl -X POST http://localhost:3000/api/jobs/{jobId}/resumes \
  -F "resumes=@/path/to/resume1.pdf"

# Multiple files
curl -X POST http://localhost:3000/api/jobs/{jobId}/resumes \
  -F "resumes=@/path/to/resume1.pdf" \
  -F "resumes=@/path/to/resume2.pdf" \
  -F "resumes=@/path/to/resume3.pdf"
```

**Response:**
```json
{
  "success": true,
  "jobId": "...",
  "resumesUploaded": 3,
  "resumeIds": ["...", "...", "..."],
  "message": "Resumes uploaded successfully. Processing started."
}
```

### 4. Check Job Status

```bash
curl http://localhost:3000/api/jobs/{jobId}/status
```

**Response:**
```json
{
  "success": true,
  "jobId": "...",
  "jobStatus": "processing",
  "createdAt": "...",
  "resumes": {
    "total": 3,
    "pending": 0,
    "processing": 1,
    "completed": 2,
    "failed": 0
  }
}
```

### 5. Get Ranked Results

```bash
curl http://localhost:3000/api/jobs/{jobId}/results
```

**Response:**
```json
{
  "success": true,
  "jobId": "...",
  "jobStatus": "completed",
  "totalCandidates": 3,
  "candidates": [
    {
      "resumeId": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "finalScore": 85,
      "ruleScore": 85,
      "matchedSkills": ["node.js", "express", "mongodb", "javascript"],
      "missingSkills": ["typescript", "docker"],
      "strengths": [
        "Strong skill match: node.js, express, mongodb, javascript",
        "5+ years of relevant experience",
        "High role relevance based on background"
      ],
      "gaps": [
        "Missing key skills: typescript, docker"
      ],
      "summary": "John Doe is a strong match for this position with excellent skill alignment and relevant experience.",
      "experience": 5,
      "skills": ["node.js", "express", "mongodb", "javascript", "rest"],
      "processedAt": "..."
    }
  ]
}
```

## Error Responses

### 404 - Job Not Found
```json
{
  "error": "Job not found"
}
```

### 400 - Validation Error
```json
{
  "error": "Job description must be at least 50 characters"
}
```

### 400 - No Files Uploaded
```json
{
  "error": "No resume files uploaded"
}
```

## Scoring System

### Rule-Based Scoring (0-100)
- **Skill Match (50%)**: Percentage of JD skills validated in work context
  - Skills must appear in resume skills list
  - **AND** must be used in Experience or Projects sections
  - Prevents resume keyword stuffing
- **Experience Match (30%)**: Years of experience vs required
- **Role Relevance (20%)**: Role-related keywords match

### Score Ranges
- **75-100**: Strong match
- **50-74**: Moderate fit
- **25-49**: Limited match
- **0-24**: Minimal alignment

### Skill Validation Logic
A skill is **matched** only if:
1. Listed in candidate's skills section
2. Actually mentioned in their Experience or Projects

**Example:**
```
Resume claims: Node.js, Docker, AWS
Experience/Projects mention: Node.js (used in 3 projects)
Result: Only Node.js counts as matched (Docker & AWS unproven)
```

## Notes
- Maximum 50 resumes per upload
- Maximum 5MB per PDF file
- Only PDF files are accepted
- Processing is asynchronous (check status endpoint)
- Results are ranked by finalScore (highest to lowest)


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jobController = require('../controllers/job.controller');

const router = express.Router();

// Configure multer for PDF uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const jobUploadDir = path.join(uploadDir, req.params.jobId);
    
    // Create job-specific directory
    if (!fs.existsSync(jobUploadDir)) {
      fs.mkdirSync(jobUploadDir, { recursive: true });
    }
    
    cb(null, jobUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Routes
router.post('/', jobController.createJob);
router.post('/:jobId/resumes', upload.array('resumes', 50), jobController.uploadResumes);
router.get('/:jobId/status', jobController.getJobStatus);
router.get('/:jobId/results', jobController.getJobResults);

module.exports = router;


const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { processResumes } = require('../services/processor');

/**
 * POST /api/jobs
 * Create a new job with job description
 */
exports.createJob = async (req, res, next) => {
  try {
    const { jdText } = req.body;
    
    // Validation
    if (!jdText || typeof jdText !== 'string') {
      return res.status(400).json({
        error: 'Job description (jdText) is required and must be a string'
      });
    }
    
    if (jdText.trim().length < 50) {
      return res.status(400).json({
        error: 'Job description must be at least 50 characters'
      });
    }
    
    // Create job
    const job = new Job({
      jdText: jdText.trim()
    });
    
    await job.save();
    
    res.status(201).json({
      success: true,
      jobId: job._id,
      status: job.status,
      createdAt: job.createdAt
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs/:jobId/resumes
 * Upload multiple resume PDFs for a job
 */
exports.uploadResumes = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const files = req.files;
    
    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }
    
    // Validate files uploaded
    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'No resume files uploaded'
      });
    }
    
    // Create resume records
    const resumeRecords = files.map(file => ({
      jobId,
      filePath: file.path,
      fileName: file.originalname,
      processingStatus: 'pending'
    }));
    
    const resumes = await Resume.insertMany(resumeRecords);
    
    // Update job status to processing
    await job.updateStatus('processing');
    
    // Trigger background processing (async, non-blocking)
    processResumes(jobId, resumes);
    
    res.status(201).json({
      success: true,
      jobId,
      resumesUploaded: resumes.length,
      resumeIds: resumes.map(r => r._id),
      message: 'Resumes uploaded successfully. Processing started.'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:jobId/status
 * Get job processing status
 */
exports.getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Get job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }
    
    // Get resume processing summary
    const processingSummary = await Resume.getProcessingSummary(jobId);
    
    res.json({
      success: true,
      jobId: job._id,
      jobStatus: job.status,
      createdAt: job.createdAt,
      resumes: processingSummary
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:jobId/results
 * Get ranked candidates for a job
 */
exports.getJobResults = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Get job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }
    
    // Get ranked resumes
    const rankedResumes = await Resume.getRankedResumes(jobId);
    
    // Format response
    const candidates = rankedResumes.map(resume => {
      // Use name if found, otherwise use filename without extension
      let displayName = resume.parsedData?.name;
      if (!displayName || displayName === 'Unknown') {
        // Extract filename from path and remove extension
        const filename = resume.fileName || resume.filePath.split('/').pop();
        displayName = filename.replace(/\.[^/.]+$/, ''); // Remove extension
      }
      
      return {
        resumeId: resume._id,
        name: displayName,
        email: resume.parsedData?.email || null,
        finalScore: resume.finalScore,
        ruleScore: resume.ruleScore,
        matchedSkills: resume.matchedSkills || [],
        missingSkills: resume.missingSkills || [],
        strengths: resume.strengths,
        gaps: resume.gaps,
        summary: resume.summary,
        experience: resume.parsedData?.experience || 0,
        skills: resume.parsedData?.skills || [],
        processedAt: resume.processedAt
      };
    });
    
    res.json({
      success: true,
      jobId: job._id,
      jobStatus: job.status,
      totalCandidates: candidates.length,
      candidates
    });
    
  } catch (error) {
    next(error);
  }
};


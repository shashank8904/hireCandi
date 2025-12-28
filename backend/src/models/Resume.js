const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    default: ''
  },
  // Parsed data from resume
  parsedData: {
    skills: [String],
    experience: {
      type: Number,
      default: 0
    },
    education: [String],
    name: String,
    email: String,
    phone: String,
    experienceText: String,
    projectsText: String
  },
  // Scoring
  ruleScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: -1 // Descending index for ranking
  },
  // AI-generated explanations
  strengths: {
    type: [String],
    default: []
  },
  gaps: {
    type: [String],
    default: []
  },
  summary: {
    type: String,
    default: ''
  },
  // Skill matching results
  matchedSkills: {
    type: [String],
    default: []
  },
  missingSkills: {
    type: [String],
    default: []
  },
  // Processing status
  processingStatus: {
    type: String,
    enum: ['pending', 'parsing', 'scoring', 'reasoning', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  error: {
    type: String,
    default: null
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient job-specific queries
resumeSchema.index({ jobId: 1, finalScore: -1 });
resumeSchema.index({ jobId: 1, processingStatus: 1 });

// Instance method to update processing status
resumeSchema.methods.updateProcessingStatus = async function(status, errorMsg = null) {
  this.processingStatus = status;
  if (errorMsg) {
    this.error = errorMsg;
  }
  if (status === 'completed') {
    this.processedAt = new Date();
  }
  return await this.save();
};

// Static method to get ranked resumes for a job
resumeSchema.statics.getRankedResumes = async function(jobId) {
  return await this.find({ 
    jobId,
    processingStatus: 'completed'
  })
  .sort({ finalScore: -1 })
  .select('-rawText -__v'); // Exclude large text field and version key
};

// Static method to get processing summary
resumeSchema.statics.getProcessingSummary = async function(jobId) {
  const resumes = await this.find({ jobId });
  
  return {
    total: resumes.length,
    pending: resumes.filter(r => r.processingStatus === 'pending').length,
    processing: resumes.filter(r => ['parsing', 'scoring', 'reasoning'].includes(r.processingStatus)).length,
    completed: resumes.filter(r => r.processingStatus === 'completed').length,
    failed: resumes.filter(r => r.processingStatus === 'failed').length
  };
};

module.exports = mongoose.model('Resume', resumeSchema);


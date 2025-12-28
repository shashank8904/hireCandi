const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jdText: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    minlength: [50, 'Job description must be at least 50 characters']
  },
  status: {
    type: String,
    enum: ['created', 'processing', 'completed'],
    default: 'created',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Index for efficient querying
jobSchema.index({ status: 1, createdAt: -1 });

// Instance method to update status
jobSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return await this.save();
};

// Static method to get job with resumes
jobSchema.statics.getJobWithResumes = async function(jobId) {
  const Resume = mongoose.model('Resume');
  const job = await this.findById(jobId);
  
  if (!job) {
    return null;
  }
  
  const resumes = await Resume.find({ jobId }).sort({ finalScore: -1 });
  
  return {
    job,
    resumes
  };
};

module.exports = mongoose.model('Job', jobSchema);


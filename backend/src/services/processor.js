const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { parseResume } = require('./resumeParser');
const { calculateScore } = require('./scoringEngine');

/**
 * Process all resumes for a job asynchronously
 * @param {string} jobId - Job ID
 * @param {Array} resumes - Array of resume records
 */
async function processResumes(jobId, resumes) {
  console.log(`Starting background processing for job ${jobId} with ${resumes.length} resumes`);

  // Process asynchronously without blocking the response
  setImmediate(async () => {
    try {
      // Get job details
      const job = await Job.findById(jobId);
      if (!job) {
        console.error(`Job ${jobId} not found`);
        return;
      }

      const jdText = job.jdText;

      // Process each resume
      for (const resume of resumes) {
        try {
          await processIndividualResume(resume, jdText);
        } catch (error) {
          console.error(`Error processing resume ${resume._id}:`, error.message);
          
          // Update resume with error status
          await Resume.findByIdAndUpdate(resume._id, {
            processingStatus: 'failed',
            error: error.message
          });
        }
      }

      // Check if all resumes are processed
      const updatedResumes = await Resume.find({ jobId });
      const allProcessed = updatedResumes.every(r => 
        r.processingStatus === 'completed' || r.processingStatus === 'failed'
      );

      if (allProcessed) {
        await job.updateStatus('completed');
        console.log(`Job ${jobId} processing completed`);
      }

    } catch (error) {
      console.error(`Error in background processing for job ${jobId}:`, error.message);
    }
  });
}

/**
 * Process a single resume
 * @param {Object} resume - Resume document
 * @param {string} jdText - Job description text
 */
async function processIndividualResume(resume, jdText) {
  try {
    console.log(`Processing resume ${resume._id}: ${resume.fileName}`);

    // Step 1: Update status to parsing
    await Resume.findByIdAndUpdate(resume._id, {
      processingStatus: 'parsing'
    });

    // Step 2: Parse resume
    const { rawText, cleanedText, parsedData } = await parseResume(resume.filePath);

    // Step 3: Update status to scoring
    await Resume.findByIdAndUpdate(resume._id, {
      processingStatus: 'scoring',
      rawText,
      parsedData
    });

    // Step 4: Calculate score
    const scoringResult = calculateScore(jdText, cleanedText, parsedData);

    // Step 5: Update resume with final results
    await Resume.findByIdAndUpdate(resume._id, {
      processingStatus: 'completed',
      ruleScore: scoringResult.ruleScore,
      finalScore: scoringResult.ruleScore, // For now, finalScore = ruleScore
      matchedSkills: scoringResult.matchedSkills,
      missingSkills: scoringResult.missingSkills,
      strengths: generateStrengths(scoringResult, parsedData),
      gaps: generateGaps(scoringResult, parsedData),
      summary: generateSummary(scoringResult, parsedData),
      processedAt: new Date()
    });

    console.log(`Successfully processed resume ${resume._id} (Score: ${scoringResult.ruleScore})`);

  } catch (error) {
    console.error(`Failed to process resume ${resume._id}:`, error.message);
    throw error;
  }
}

/**
 * Generate strengths based on scoring results
 * @param {Object} scoringResult - Scoring results
 * @param {Object} parsedData - Parsed resume data
 * @returns {Array<string>} - List of strengths
 */
function generateStrengths(scoringResult, parsedData) {
  const strengths = [];

  if (scoringResult.matchedSkills.length > 0) {
    strengths.push(`Strong skill match: ${scoringResult.matchedSkills.slice(0, 5).join(', ')}`);
  }

  if (parsedData.experience > 0) {
    strengths.push(`${parsedData.experience}+ years of relevant experience`);
  }

  if (scoringResult.breakdown.roleScore >= 70) {
    strengths.push('High role relevance based on background');
  }

  if (parsedData.education && parsedData.education.length > 0) {
    strengths.push(`Education: ${parsedData.education.slice(0, 2).join(', ')}`);
  }

  if (strengths.length === 0) {
    strengths.push('Basic qualifications present');
  }

  return strengths;
}

/**
 * Generate gaps based on scoring results
 * @param {Object} scoringResult - Scoring results
 * @param {Object} parsedData - Parsed resume data
 * @returns {Array<string>} - List of gaps
 */
function generateGaps(scoringResult, parsedData) {
  const gaps = [];

  if (scoringResult.missingSkills.length > 0) {
    gaps.push(`Missing key skills: ${scoringResult.missingSkills.slice(0, 5).join(', ')}`);
  }

  if (scoringResult.breakdown.experienceScore < 50) {
    gaps.push('Limited relevant experience');
  }

  if (scoringResult.breakdown.roleScore < 40) {
    gaps.push('Lower role relevance match');
  }

  if (gaps.length === 0) {
    gaps.push('No significant gaps identified');
  }

  return gaps;
}

/**
 * Generate summary based on scoring results
 * @param {Object} scoringResult - Scoring results
 * @param {Object} parsedData - Parsed resume data
 * @returns {string} - Summary text
 */
function generateSummary(scoringResult, parsedData) {
  const score = scoringResult.ruleScore;
  const name = parsedData.name || 'Candidate';

  let summary = '';

  if (score >= 75) {
    summary = `${name} is a strong match for this position with excellent skill alignment and relevant experience.`;
  } else if (score >= 50) {
    summary = `${name} shows moderate fit for this role with some matching skills and experience.`;
  } else if (score >= 25) {
    summary = `${name} has limited match with the job requirements and may need additional training.`;
  } else {
    summary = `${name} has minimal alignment with the required skills and experience for this position.`;
  }

  return summary;
}

module.exports = {
  processResumes,
  processIndividualResume
};


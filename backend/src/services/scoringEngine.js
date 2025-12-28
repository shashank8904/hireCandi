const { cleanText } = require('../utils/textCleaner');
const { extractSkills } = require('./resumeParser');

/**
 * Calculate rule-based score for a resume against a job description
 * @param {string} jobDescriptionText - Job description text
 * @param {string} resumeText - Resume text (cleaned)
 * @param {Object} parsedData - Parsed resume data (skills, experience, etc.)
 * @returns {Object} - Scoring results
 */
function calculateScore(jobDescriptionText, resumeText, parsedData = {}) {
  try {
    const jdCleaned = cleanText(jobDescriptionText);
    const resumeCleaned = cleanText(resumeText);

    // Extract skills from JD
    const jdSkills = extractSkills(jdCleaned);
    const resumeSkills = parsedData.skills || extractSkills(resumeCleaned);

    // Get experience and projects text for skill validation
    const experienceText = parsedData.experienceText || '';
    const projectsText = parsedData.projectsText || '';
    const workContext = `${experienceText} ${projectsText}`.toLowerCase();

    // 1. Skill Match Score (50%) - with context validation
    const skillScore = calculateSkillScore(jdSkills, resumeSkills, experienceText, projectsText);

    // 2. Experience Score (30%)
    const experienceScore = calculateExperienceScore(jdCleaned, parsedData.experience || 0);

    // 3. Role Relevance Score (20%)
    const roleScore = calculateRoleRelevanceScore(jdCleaned, resumeCleaned);

    // Calculate weighted final score
    const ruleScore = Math.round(
      (skillScore * 0.5) + 
      (experienceScore * 0.3) + 
      (roleScore * 0.2)
    );

    // Identify matched and missing skills (with context validation)
    const matchedSkills = jdSkills.filter(skill => {
      const isInSkillsList = resumeSkills.some(rSkill => 
        rSkill.toLowerCase() === skill.toLowerCase()
      );
      
      // Validate skill appears in work context
      if (workContext.length > 10) {
        const skillInContext = workContext.includes(skill.toLowerCase());
        return isInSkillsList && skillInContext;
      }
      
      return isInSkillsList;
    });
    
    const missingSkills = jdSkills.filter(skill => 
      !matchedSkills.includes(skill)
    );

    return {
      ruleScore: Math.min(100, Math.max(0, ruleScore)), // Clamp between 0-100
      matchedSkills,
      missingSkills,
      breakdown: {
        skillScore: Math.round(skillScore),
        experienceScore: Math.round(experienceScore),
        roleScore: Math.round(roleScore)
      }
    };

  } catch (error) {
    console.error('Error calculating score:', error.message);
    
    // Return default score on error
    return {
      ruleScore: 0,
      matchedSkills: [],
      missingSkills: [],
      breakdown: {
        skillScore: 0,
        experienceScore: 0,
        roleScore: 0
      }
    };
  }
}

/**
 * Calculate skill match score (0-100)
 * Validates that matched skills actually appear in experience or projects
 * @param {Array<string>} jdSkills - Skills from job description
 * @param {Array<string>} resumeSkills - Skills from resume
 * @param {string} experienceText - Experience section text (optional)
 * @param {string} projectsText - Projects section text (optional)
 * @returns {number} - Score (0-100)
 */
function calculateSkillScore(jdSkills, resumeSkills, experienceText = '', projectsText = '') {
  if (jdSkills.length === 0) {
    return 50; // Neutral score if no skills in JD
  }

  // Combine experience and projects for skill validation
  const workContext = `${experienceText} ${projectsText}`.toLowerCase();

  const matchCount = jdSkills.filter(skill => {
    // Check if skill is in resume skills list
    const isInSkillsList = resumeSkills.some(rSkill => 
      rSkill.toLowerCase() === skill.toLowerCase()
    );

    // If we have work context, validate the skill appears there too
    if (workContext.length > 10) {
      const skillInContext = workContext.includes(skill.toLowerCase());
      return isInSkillsList && skillInContext;
    }

    // If no work context available, just check skills list
    return isInSkillsList;
  }).length;

  const matchPercentage = (matchCount / jdSkills.length) * 100;
  
  return matchPercentage;
}

/**
 * Calculate experience score (0-100)
 * @param {string} jdText - Job description text
 * @param {number} resumeExperience - Years of experience from resume
 * @returns {number} - Score (0-100)
 */
function calculateExperienceScore(jdText, resumeExperience) {
  // Extract required experience from JD
  const requiredExp = extractRequiredExperience(jdText);

  if (requiredExp === 0) {
    return 70; // Neutral-positive score if no experience requirement
  }

  if (resumeExperience === 0) {
    return 30; // Low score if no experience found in resume
  }

  // Score based on how well experience matches requirement
  if (resumeExperience >= requiredExp) {
    // Bonus for more experience (up to 100)
    return Math.min(100, 80 + (resumeExperience - requiredExp) * 2);
  } else {
    // Penalty for less experience
    const ratio = resumeExperience / requiredExp;
    return Math.round(ratio * 70); // Max 70 if less than required
  }
}

/**
 * Calculate role relevance score (0-100)
 * @param {string} jdText - Job description text
 * @param {string} resumeText - Resume text
 * @returns {number} - Score (0-100)
 */
function calculateRoleRelevanceScore(jdText, resumeText) {
  // Common role-related keywords
  const roleKeywords = extractRoleKeywords(jdText);

  if (roleKeywords.length === 0) {
    return 60; // Neutral score if no clear role keywords
  }

  const matchCount = roleKeywords.filter(keyword => 
    resumeText.includes(keyword)
  ).length;

  const matchPercentage = (matchCount / roleKeywords.length) * 100;
  
  return matchPercentage;
}

/**
 * Extract required experience from job description
 * @param {string} text - Job description text
 * @returns {number} - Required years of experience
 */
function extractRequiredExperience(text) {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
    /experience\s*:?\s*(\d+)\+?\s*years?/i,
    /minimum\s*(?:of\s*)?(\d+)\+?\s*years?/i,
    /at least\s*(\d+)\+?\s*years?/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return 0;
}

/**
 * Extract role-related keywords from job description
 * @param {string} text - Job description text
 * @returns {Array<string>} - Role keywords
 */
function extractRoleKeywords(text) {
  const keywords = [
    'engineer', 'developer', 'architect', 'lead', 'senior', 'junior',
    'manager', 'director', 'analyst', 'designer', 'consultant',
    'backend', 'frontend', 'fullstack', 'full stack', 'devops',
    'data', 'ml', 'ai', 'mobile', 'web', 'cloud', 'security'
  ];

  return keywords.filter(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(text);
  });
}

module.exports = {
  calculateScore,
  calculateSkillScore,
  calculateExperienceScore,
  calculateRoleRelevanceScore
};


const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const { 
  cleanText, 
  extractEmail, 
  extractPhone, 
  extractExperience,
  extractName,
  extractSection
} = require('../utils/textCleaner');

/**
 * Parse PDF resume file and extract text
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<Object>} - Parsed resume data
 */
async function parseResume(filePath) {
  try {
    // Read PDF file
    const dataBuffer = await fs.readFile(filePath);
    
    // Parse PDF
    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('No text found in PDF');
    }

    // Clean text
    const cleanedText = cleanText(rawText);

    // Extract sections
    const experienceSection = extractSection(rawText, 'experience');
    const projectsSection = extractSection(rawText, 'projects');

    // Extract structured data
    const parsedData = {
      name: extractName(rawText),
      email: extractEmail(rawText),
      phone: extractPhone(rawText),
      experience: extractExperience(cleanedText),
      skills: extractSkills(cleanedText),
      education: extractEducation(rawText),
      experienceText: cleanText(experienceSection),
      projectsText: cleanText(projectsSection)
    };

    return {
      rawText,
      cleanedText,
      parsedData
    };

  } catch (error) {
    console.error(`Error parsing resume ${filePath}:`, error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Extract skills from resume text
 * @param {string} text - Cleaned resume text
 * @returns {Array<string>} - List of skills found
 */
function extractSkills(text) {
  // Common tech skills to look for
  const skillKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
    'node.js', 'nodejs', 'react', 'angular', 'vue', 'express', 'django', 'flask', 'spring',
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
    'html', 'css', 'sql', 'nosql', 'graphql', 'rest', 'api',
    'git', 'agile', 'scrum', 'ci/cd', 'devops',
    'machine learning', 'deep learning', 'ai', 'nlp',
    'microservices', 'system design', 'architecture'
  ];

  const foundSkills = [];

  for (const skill of skillKeywords) {
    // Check for whole word match (with word boundaries)
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

/**
 * Extract education information from resume text
 * @param {string} text - Resume text
 * @returns {Array<string>} - List of education qualifications
 */
function extractEducation(text) {
  const educationKeywords = [
    'phd', 'ph.d', 'doctorate',
    'master', 'msc', 'm.sc', 'mba', 'm.b.a', 'ms',
    'bachelor', 'bsc', 'b.sc', 'btech', 'b.tech', 'be', 'b.e', 'ba', 'b.a', 'bs',
    'diploma', 'associate'
  ];

  const foundEducation = [];

  for (const keyword of educationKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(text)) {
      foundEducation.push(keyword.toUpperCase());
    }
  }

  return [...new Set(foundEducation)]; // Remove duplicates
}

module.exports = {
  parseResume,
  extractSkills,
  extractEducation
};


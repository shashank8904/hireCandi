/**
 * Text cleaning utilities for resume and job description processing
 */

/**
 * Clean and normalize text
 * @param {string} text - Raw text to clean
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ') // Keep alphanumeric, spaces, +, #, ., -
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Extract email from text
 * @param {string} text - Text to search
 * @returns {string|null} - Email address or null
 */
function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

/**
 * Extract phone number from text
 * @param {string} text - Text to search
 * @returns {string|null} - Phone number or null
 */
function extractPhone(text) {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

/**
 * Extract years of experience from text
 * @param {string} text - Text to search
 * @returns {number} - Years of experience (0 if not found)
 */
function extractExperience(text) {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
    /experience\s*:?\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?\s*(?:of\s*)?experience/i
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
 * Extract name from resume text (enhanced heuristic)
 * @param {string} text - Resume text
 * @returns {string|null} - Extracted name or null
 */
function extractName(text) {
  if (!text) return null;

  // Try multiple strategies to find the name
  const lines = text.split('\n').slice(0, 15); // Check first 15 lines
  
  // Strategy 1: Look for lines with 2-4 capitalized words
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, emails, phone numbers, and URLs
    if (!trimmed || 
        trimmed.includes('@') || 
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmed) ||
        trimmed.toLowerCase().includes('http')) {
      continue;
    }
    
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    
    // Look for 2-4 words that look like names
    if (words.length >= 2 && words.length <= 4) {
      // Check if words start with capital letter and contain mostly letters
      const isLikelyName = words.every(word => {
        // Remove any trailing punctuation
        const cleanWord = word.replace(/[.,;:!?]$/, '');
        // Must start with capital and be mostly alphabetic
        return /^[A-Z][a-zA-Z]{1,}/.test(cleanWord) && 
               !/\d/.test(cleanWord) &&
               cleanWord.length > 1;
      });
      
      if (isLikelyName) {
        // Clean up and return
        const name = words.map(w => w.replace(/[.,;:!?]$/, '')).join(' ');
        // Avoid common header words
        const avoidWords = ['resume', 'curriculum', 'vitae', 'cv', 'profile', 'professional'];
        if (!avoidWords.some(avoid => name.toLowerCase().includes(avoid))) {
          return name;
        }
      }
    }
  }
  
  // Strategy 2: Look for "Name:" or "Full Name:" pattern
  for (const line of lines) {
    const nameMatch = line.match(/(?:name|full name):\s*([A-Z][a-zA-Z\s]{2,40})/i);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
  }
  
  return null;
}

/**
 * Extract sections from resume text
 * @param {string} text - Resume text
 * @param {string} sectionName - Section to extract (e.g., 'experience', 'projects')
 * @returns {string} - Extracted section text
 */
function extractSection(text, sectionName) {
  const sectionPatterns = {
    experience: /(?:work\s+)?experience|employment\s+history|professional\s+experience/i,
    projects: /projects?|portfolio|personal\s+projects|key\s+projects/i,
    skills: /(?:technical\s+)?skills?|competencies|expertise/i,
    education: /education|academic|qualifications/i
  };

  const pattern = sectionPatterns[sectionName];
  if (!pattern) {
    return '';
  }

  const lines = text.split('\n');
  let inSection = false;
  let sectionText = [];
  let sectionStarted = false;

  // Common section headers that indicate a new section
  const otherSectionPatterns = Object.values(sectionPatterns).filter(p => p !== pattern);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line starts the target section
    if (pattern.test(line)) {
      inSection = true;
      sectionStarted = true;
      continue;
    }

    // Check if we've hit another section (stop collecting)
    if (sectionStarted && otherSectionPatterns.some(p => p.test(line))) {
      break;
    }

    // Collect lines if we're in the section
    if (inSection && line.length > 0) {
      sectionText.push(line);
    }
  }

  return sectionText.join(' ');
}

module.exports = {
  cleanText,
  extractEmail,
  extractPhone,
  extractExperience,
  extractName,
  extractSection
};


const API_BASE_URL = '/api';

export const api = {
  // Create a new job with job description
  async createJob(jobDescription) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jdText: jobDescription }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create job' }));
        throw new Error(error.error || 'Failed to create job');
      }

      return response.json();
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },

  // Upload resumes for a job
  async uploadResumes(jobId, files) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('resumes', file);
      });

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/resumes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to upload resumes' }));
        throw new Error(error.error || 'Failed to upload resumes');
      }

      return response.json();
    } catch (error) {
      console.error('Upload resumes error:', error);
      throw error;
    }
  },

  // Get job processing status
  async getJobStatus(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch job status' }));
        throw new Error(error.error || 'Failed to fetch job status');
      }

      return response.json();
    } catch (error) {
      console.error('Get job status error:', error);
      throw error;
    }
  },

  // Get job results
  async getJobResults(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/results`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch job results' }));
        throw new Error(error.error || 'Failed to fetch job results');
      }

      return response.json();
    } catch (error) {
      console.error('Get job results error:', error);
      throw error;
    }
  },
};


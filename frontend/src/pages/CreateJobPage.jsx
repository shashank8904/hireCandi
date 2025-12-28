import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      setError('Only PDF files are allowed');
      return;
    }
    
    setSelectedFiles(pdfFiles);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      setError('Please add a job description to continue.');
      return;
    }
    
    if (selectedFiles.length === 0) {
      setError('Please upload at least one PDF resume.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Create the job
      const { jobId } = await api.createJob(jobDescription);

      // Step 2: Upload resumes
      await api.uploadResumes(jobId, selectedFiles);

      // Step 3: Navigate to processing page
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold">HireCandi</p>
          <h1 className="text-4xl font-semibold text-slate-900 mt-2">Validate shortlisted candidates</h1>
          <p className="text-lg text-slate-600 mt-3 max-w-3xl">
            Upload Naukri-sourced resumes and let HireCandi rank them with clear, explainable signals.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Description Card */}
          <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Job Description</p>
                  <h2 className="text-xl font-semibold text-slate-900">What does great look like?</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Include role context, required skills, experience range, and team expectations.
                  </p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">Required</span>
              </div>
              <textarea
                id="jobDescription"
                rows={10}
                className="mt-4 w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Example: We need a Senior Backend Engineer with 5+ years in Node.js/Express, MongoDB, REST APIs, system design, and production scaling..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Upload Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Resume upload</p>
                  <h2 className="text-xl font-semibold text-slate-900">Drop PDFs to analyze</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Upload up to 50 resumes (PDF only). We’ll extract signals and rank automatically.
                  </p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">PDF</span>
              </div>

              <label
                htmlFor="resumes"
                className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg px-6 py-8 bg-slate-50/50 cursor-pointer hover:border-slate-300 transition"
              >
                <div className="text-center space-y-2">
                  <div className="text-slate-900 font-medium">Drag & drop resumes</div>
                  <div className="text-sm text-slate-500">or click to browse PDF files</div>
                  {selectedFiles.length > 0 && (
                    <div className="text-sm text-slate-600 mt-2">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="resumes"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Start analysis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


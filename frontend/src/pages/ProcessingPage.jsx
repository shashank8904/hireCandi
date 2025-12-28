import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';

export default function ProcessingPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const data = await api.getJobStatus(jobId);
        setStatus(data);

        // If job is completed, redirect to results page
        if (data.jobStatus === 'completed') {
          clearInterval(intervalId);
          navigate(`/jobs/${jobId}/results`);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch status');
        clearInterval(intervalId);
      }
    };

    // Fetch immediately
    fetchStatus();

    // Then poll every 3 seconds
    intervalId = setInterval(fetchStatus, 3000);

    // Cleanup on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Extract resume counts from the API response
  const { resumes } = status;
  const totalResumes = resumes?.total || 0;
  const completedResumes = resumes?.completed || 0;
  const processingResumes = resumes?.processing || 0;
  const failedResumes = resumes?.failed || 0;
  const completionPercent =
    totalResumes > 0 ? Math.round((completedResumes / totalResumes) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold">Processing</p>
              <h1 className="text-3xl font-semibold text-slate-900 mt-2">Analyzing resumes…</h1>
              <p className="text-slate-600 mt-1">We’re extracting signals and ranking candidates.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Status</p>
              <p className="text-lg font-semibold text-blue-600 capitalize">{status.jobStatus}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Progress Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-slate-500">Progress</p>
                  <p className="text-4xl font-semibold text-slate-900 mt-1">{completionPercent}%</p>
                </div>
                <p className="text-sm text-slate-500">
                  {completedResumes} of {totalResumes} complete
                </p>
              </div>
              <div className="mt-4 w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Counts Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase">Processing</p>
                <p className="text-2xl font-semibold text-blue-700 mt-1">{processingResumes}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Completed</p>
                <p className="text-2xl font-semibold text-emerald-700 mt-1">{completedResumes}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Failed</p>
                <p className="text-2xl font-semibold text-amber-700 mt-1">{failedResumes}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Total</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{totalResumes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


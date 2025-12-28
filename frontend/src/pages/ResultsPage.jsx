import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';
import CandidateDetailsModal from '../components/CandidateDetailsModal';

export default function ResultsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getJobResults(jobId);
        // Map backend response to include fit label
        const candidatesWithFit = (data.candidates || []).map(candidate => ({
          ...candidate,
          fit: getFitLabel(candidate.finalScore)
        }));
        setResults(candidatesWithFit);
      } catch (err) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [jobId]);

  // Calculate fit label based on score
  const getFitLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Partial';
    return 'Low relevance';
  };

  const getFitBadgeColor = (fit) => {
    switch (fit.toLowerCase()) {
      case 'strong':
        return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100';
      case 'partial':
        return 'bg-blue-50 text-blue-800 ring-1 ring-blue-100';
      case 'low relevance':
        return 'bg-amber-50 text-amber-800 ring-1 ring-amber-100';
      default:
        return 'bg-slate-50 text-slate-800 ring-1 ring-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold">Results</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Candidate ranking</h1>
            <p className="text-slate-600 mt-1">{results.length} candidate(s) scored and explained.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
          >
            New job
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {results.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No candidates found yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Final Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Fit</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((candidate, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">#{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{candidate.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl font-semibold">{candidate.finalScore}</span>
                          <span className="text-slate-500 text-sm">/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getFitBadgeColor(
                            candidate.fit
                          )}`}
                        >
                          {candidate.fit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}


import { useEffect } from 'react';

export default function CandidateDetailsModal({ candidate, onClose }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{candidate.name}</h2>
            <p className="text-sm text-slate-600 mt-1">
              Score: {candidate.finalScore}/100 • Fit: {candidate.fit}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          {candidate.summary && (
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
              <p className="text-slate-700 leading-relaxed">{candidate.summary}</p>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            {candidate.strengths && candidate.strengths.length > 0 && (
              <section className="space-y-2 bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Strengths</h3>
                <ul className="space-y-2">
                  {candidate.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-emerald-500 mr-2 mt-1">•</span>
                      <span className="text-emerald-900 text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Gaps */}
            {candidate.gaps && candidate.gaps.length > 0 && (
              <section className="space-y-2 bg-amber-50 border border-amber-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Skills to verify</h3>
                <ul className="space-y-2">
                  {candidate.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2 mt-1">•</span>
                      <span className="text-amber-900 text-sm">{gap}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Validated skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 text-sm font-medium rounded-md border border-emerald-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Missing Skills */}
            {candidate.missingSkills && candidate.missingSkills.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Skills to verify</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-50 text-amber-800 text-sm font-medium rounded-md border border-amber-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


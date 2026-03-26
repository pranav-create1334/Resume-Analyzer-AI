import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={`w-full rounded-[2rem] border border-white/70 bg-gradient-to-b ${gradientClass} to-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8`}>
      <div className="mb-6 flex items-center gap-4">
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        <div>
          <p className="mb-2 w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Screening readiness</p>
          <h2 className="text-2xl font-bold !text-slate-950">ATS Score - {score}/100</h2>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="mb-4 text-slate-600 leading-7">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 rounded-[1.25rem] border border-white/80 bg-white/75 px-4 py-3 shadow-[0_12px_30px_rgba(48,40,29,0.05)]">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-5 h-5 mt-1"
              />
              <p className={suggestion.type === "good" ? "text-green-700" : "text-amber-700"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="italic text-slate-700">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  )
}

export default ATS

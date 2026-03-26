import { Link } from "react-router-dom";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card group animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-3">
                    <span className="section-kicker w-fit">
                        Resume Snapshot
                    </span>
                    {companyName && <h2 className="break-words !text-slate-950 font-bold">{companyName}</h2>}
                    {jobTitle && <h3 className="break-words text-base text-slate-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-slate-950 font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0 self-start rounded-[1.75rem] border border-white/70 bg-white/70 p-2 shadow-[0_16px_30px_rgba(48,40,29,0.07)]">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full overflow-hidden rounded-[1.5rem]">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="h-[350px] w-full object-cover object-top transition duration-300 group-hover:scale-[1.02] max-sm:h-[200px]"
                        />
                    </div>
                </div>
                )}
            <div className="mt-auto flex items-center justify-between border-t border-slate-200/70 pt-3 text-sm font-medium text-slate-500">
                <span>View full breakdown</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-white transition duration-200 group-hover:translate-x-1">Open</span>
            </div>
        </Link>
    )
}
export default ResumeCard

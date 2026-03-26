import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Ai-Powered Resume Analyzer | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="feedback-shell">
                <section className="feedback-section sticky top-24 h-fit self-start rounded-[2rem] border border-white/70 bg-[url('/images/bg-small.svg')] bg-cover bg-center lg:max-w-[44%] lg:bg-[#f6f1ea]">
                    {imageUrl && resumeUrl && (
                        <div className="gradient-border h-full w-full animate-in fade-in duration-1000">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="h-full max-h-[75vh] w-full rounded-[1.5rem] object-contain"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section lg:max-w-[56%]">
                    <div className="report-surface">
                        <div className="report-header">
                            <div>
                                <p className="section-kicker w-fit">Detailed analysis</p>
                                <h2 className="mt-4 text-4xl !text-black font-bold">Resume Review</h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    Explore the overall score, ATS readiness, and detailed category guidance in a cleaner review layout.
                                </p>
                            </div>
                            <div className="report-highlight">
                                <p className="status-pill">Live breakdown</p>
                                <h3 className="mt-4 text-2xl font-semibold">Interview-ready insights</h3>
                                <p className="mt-3 text-sm leading-6 text-white/80">
                                    Every section is organized so you can scan strengths, issues, and next improvements quickly.
                                </p>
                            </div>
                        </div>
                    </div>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume

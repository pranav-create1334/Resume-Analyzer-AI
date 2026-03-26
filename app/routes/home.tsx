import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ai-Powered Resume Analyzer" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="app-shell">
    <div className="shell-content">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <div className="hero-frame split-panel items-center">
            <div className="hero-copy">
              <p className="eyebrow">Sharper first impressions</p>
              <h1>Track Your Applications & Resume Ratings</h1>
              {!loadingResumes && resumes?.length === 0 ? (
                  <h2>No resumes found yet. Upload your first resume to unlock a polished AI review.</h2>
              ): (
                <h2>Review your submissions, compare scores, and spot the strongest version of your resume.</h2>
              )}
              <p className="section-copy">
                Keep every application in one clean workspace with clearer visuals, stronger hierarchy, and instant access to your latest resume analysis.
              </p>
              <div className="hero-actions">
                <Link to="/upload" className="primary-button w-fit min-w-[12rem]">
                  Analyze New Resume
                </Link>
                <div className="secondary-button cursor-default">
                  ATS insights in one view
                </div>
              </div>
            </div>

            <div className="hero-preview float-slower">
              <div className="hero-preview-card">
                <div className="preview-stack">
                  <div className="preview-resume">
                    <div className="preview-chip-row">
                      <span className="preview-chip">Score</span>
                      <span className="preview-chip">ATS</span>
                      <span className="preview-chip">Insights</span>
                    </div>
                    <div className="preview-line w-[70%]" />
                    <div className="preview-line soft w-[48%]" />
                    <div className="space-y-3 pt-3">
                      <div className="preview-line soft w-full" />
                      <div className="preview-line soft w-[90%]" />
                      <div className="preview-line soft w-[82%]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-[1.2rem] bg-[#f6efe7] p-4">
                        <div className="preview-line w-[60%]" />
                        <div className="preview-line soft mt-3 w-[80%]" />
                      </div>
                      <div className="rounded-[1.2rem] bg-[#eff3ff] p-4">
                        <div className="preview-line w-[55%]" />
                        <div className="preview-line soft mt-3 w-[74%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="metrics-row">
            <div className="metric-card animate-in fade-in duration-700 stagger-1">
              <strong>{loadingResumes ? "..." : resumes.length}</strong>
              <span>Saved Resume Reviews</span>
            </div>
            <div className="metric-card animate-in fade-in duration-700 stagger-2">
              <strong>ATS</strong>
              <span>Screening clarity at a glance</span>
            </div>
            <div className="metric-card animate-in fade-in duration-700 stagger-3">
              <strong>AI</strong>
              <span>Actionable guidance for each version</span>
            </div>
          </div>
        </div>
      {loadingResumes && (
          <div className="panel-card flex flex-col items-center justify-center gap-4">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Loading resumes</p>
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="panel-card mt-4 flex flex-col items-center justify-center gap-4 text-center">
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Start with one upload and we will turn your resume into a clearer, easier-to-review scorecard with targeted improvement guidance.
            </p>
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
      </section>
    </div>
  </main>
}

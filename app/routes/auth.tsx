import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Ai-Powered Resume Analyzer | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="app-shell bg-[url('/images/bg-auth.svg')] bg-cover">
            <div className="shell-content auth-shell">
                <section className="auth-card">
                    <div className="auth-card-inner">
                        <div className="auth-art">
                            <div className="auth-art-copy">
                                <p className="eyebrow border-white/20 bg-white/10 text-white">Secure workspace</p>
                                <h1 className="mt-6 !text-white">Welcome</h1>
                                <h2 className="mt-4 !text-white/80">Log in to continue your job journey</h2>
                                <p className="mt-6 max-w-md text-base leading-7 text-white/72">
                                    Keep your uploads, role comparisons, and AI review history in one focused private workspace.
                                </p>
                            </div>
                            <div className="auth-art-card">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Workspace benefits</p>
                                <div className="mt-4 space-y-3 text-sm text-white/82">
                                    <p>Review saved resumes in one place.</p>
                                    <p>Compare ATS outcomes across applications.</p>
                                    <p>Jump back into the latest analysis instantly.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-8 rounded-[1.7rem] bg-white/82 p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-10">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <p className="section-kicker">Account access</p>
                                <h2 className="text-4xl font-bold !text-slate-950">Continue to your dashboard</h2>
                                <p className="max-w-md text-base leading-7 text-slate-600">
                                    Sign in once to analyze resumes, store results, and open any saved review whenever you need it.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                {isLoading ? (
                                    <button className="auth-button animate-pulse">
                                        <p>Signing you in...</p>
                                    </button>
                                ) : (
                                    <>
                                        {auth.isAuthenticated ? (
                                            <button className="auth-button" onClick={auth.signOut}>
                                                <p>Log Out</p>
                                            </button>
                                        ) : (
                                            <button className="auth-button" onClick={auth.signIn}>
                                                <p>Log In</p>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth

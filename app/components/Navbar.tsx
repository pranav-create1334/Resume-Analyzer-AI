import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="flex min-w-0 flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Resume Intelligence</span>
                <p className="text-xl font-bold text-gradient sm:text-2xl">AI-Powered Resume Analyzer</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit min-w-[10rem]">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar

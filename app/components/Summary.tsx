import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
            : score > 49
        ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-3 items-center justify-center">
                    <p className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-xl font-semibold text-slate-700 sm:text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="panel-card w-full">
            <div className="flex flex-col gap-6 border-b border-slate-200/70 pb-6 sm:flex-row sm:items-center sm:p-0">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <p className="section-kicker w-fit">Overall performance</p>
                    <h2 className="text-2xl font-bold !text-slate-950">Your Resume Score</h2>
                    <p className="text-sm leading-7 text-slate-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    )
}
export default Summary

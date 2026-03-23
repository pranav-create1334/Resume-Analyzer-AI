import type { ActionFunctionArgs } from "react-router";
import { analyzeResumeWithGemini } from "~/lib/gemini.server";

export async function action({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const jobTitle = String(formData.get("jobTitle") || "");
        const jobDescription = String(formData.get("jobDescription") || "");

        if (!(file instanceof File)) {
            return Response.json(
                { ok: false, error: "Resume PDF file is required." },
                { status: 400 }
            );
        }

        if (file.type && file.type !== "application/pdf") {
            return Response.json(
                { ok: false, error: "Only PDF resumes are supported." },
                { status: 400 }
            );
        }

        const feedback = await analyzeResumeWithGemini({
            file,
            jobTitle,
            jobDescription,
        });

        return Response.json({ ok: true, feedback });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to analyze resume.";

        return Response.json({ ok: false, error: message }, { status: 500 });
    }
}

export async function loader() {
    return Response.json(
        { ok: false, error: "Method not allowed." },
        { status: 405 }
    );
}

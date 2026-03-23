import { AIResponseFormat, prepareInstructions } from "../../constants";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type JsonSchema = {
    type: string | string[];
    description?: string;
    properties?: Record<string, JsonSchema>;
    items?: JsonSchema;
    required?: string[];
    minimum?: number;
    maximum?: number;
    enum?: string[];
    additionalProperties?: boolean;
};

const feedbackSchema: JsonSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "overallScore",
        "ATS",
        "toneAndStyle",
        "content",
        "structure",
        "skills",
    ],
    properties: {
        overallScore: {
            type: "number",
            description: "Overall resume quality score from 0 to 100.",
            minimum: 0,
            maximum: 100,
        },
        ATS: {
            type: "object",
            additionalProperties: false,
            required: ["score", "tips"],
            properties: {
                score: {
                    type: "number",
                    description: "ATS suitability score from 0 to 100.",
                    minimum: 0,
                    maximum: 100,
                },
                tips: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: false,
                        required: ["type", "tip"],
                        properties: {
                            type: {
                                type: "string",
                                enum: ["good", "improve"],
                            },
                            tip: {
                                type: "string",
                                description: "A concise ATS-related suggestion.",
                            },
                        },
                    },
                },
            },
        },
        toneAndStyle: createDetailedSectionSchema("tone and style"),
        content: createDetailedSectionSchema("content"),
        structure: createDetailedSectionSchema("structure"),
        skills: createDetailedSectionSchema("skills"),
    },
};

function createDetailedSectionSchema(sectionName: string): JsonSchema {
    return {
        type: "object",
        additionalProperties: false,
        required: ["score", "tips"],
        properties: {
            score: {
                type: "number",
                description: `${sectionName} score from 0 to 100.`,
                minimum: 0,
                maximum: 100,
            },
            tips: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["type", "tip", "explanation"],
                    properties: {
                        type: {
                            type: "string",
                            enum: ["good", "improve"],
                        },
                        tip: {
                            type: "string",
                            description: `A short title for the ${sectionName} feedback.`,
                        },
                        explanation: {
                            type: "string",
                            description: `A detailed explanation for the ${sectionName} feedback.`,
                        },
                    },
                },
            },
        },
    };
}

function getTextFromGeminiResponse(payload: any): string {
    const parts = payload?.candidates?.[0]?.content?.parts;

    if (!Array.isArray(parts)) {
        throw new Error("Gemini returned an unexpected response shape.");
    }

    const text = parts
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("")
        .trim();

    if (!text) {
        throw new Error("Gemini returned an empty response.");
    }

    return text;
}

function parseFeedback(text: string): Feedback {
    const sanitized = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return JSON.parse(sanitized) as Feedback;
}

function ensureGeminiApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing GEMINI_API_KEY. Add it to the project root .env file."
        );
    }

    return apiKey;
}

export async function analyzeResumeWithGemini({
    file,
    jobTitle,
    jobDescription,
}: {
    file: File;
    jobTitle: string;
    jobDescription: string;
}): Promise<Feedback> {
    const apiKey = ensureGeminiApiKey();
    const buffer = Buffer.from(await file.arrayBuffer());
    const prompt = `${prepareInstructions({ jobTitle, jobDescription })}

Schema reminder:
${AIResponseFormat}`;

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: file.type || "application/pdf",
                                data: buffer.toString("base64"),
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseJsonSchema: feedbackSchema,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Gemini request failed (${response.status}): ${errorText || "Unknown error"}`
        );
    }

    const payload = await response.json();
    const responseText = getTextFromGeminiResponse(payload);

    return parseFeedback(responseText);
}

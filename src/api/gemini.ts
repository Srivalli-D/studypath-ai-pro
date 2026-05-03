import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRoadmapAI(goal: string, skills: string, level: string, timeline: string) {
  const prompt = `
    Generate a detailed career roadmap for a student with the following goal: "${goal}".
    Current Skills: "${skills}".
    Experience Level: "${level}".
    Timeline: "${timeline}".

    The response must be a valid JSON array of steps.
    Each step should be an object with the following properties:
    - title: A short title for the step.
    - description: A detailed explanation of what to learn or do.
    - resources: A string with suggested learning resources.
    - duration: Estimated time for this step.

    Format: JSON only.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            resources: { type: Type.STRING },
            duration: { type: Type.STRING },
          },
          required: ["title", "description", "resources", "duration"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateResumeCritiqueAI(resumeText: string, targetRole: string) {
  const prompt = `
    You are a senior recruiter at a top tech company. Analyze the following resume for a student applying for a "${targetRole || 'Software Engineering Intern'}" position.
    
    Resume content:
    "${resumeText}"
    
    Provide a critique in JSON format with:
    1. score: (0-100)
    2. strengths: string array of what is good
    3. weaknesses: string array of what needs improvement
    4. advice: string array of actionable steps to take
    5. formatted_feedback: a markdown string for a professional summary.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.ARRAY, items: { type: Type.STRING } },
          formatted_feedback: { type: Type.STRING }
        },
        required: ["score", "strengths", "weaknesses", "advice", "formatted_feedback"]
      },
    },
  });

  return JSON.parse(response.text);
}

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
});

function cleanJsonText(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function generateRoadmapAI(
  goal: string,
  skills: string,
  level: string,
  timeline: string
) {
  const prompt = `
Generate a career roadmap for a student.

Goal: ${goal}
Current Skills: ${skills}
Experience Level: ${level}
Timeline: ${timeline}

Return ONLY a valid JSON array.
Each item must have:
- title
- description
- resources
- duration

Example:
[
  {
    "title": "Learn JavaScript Basics",
    "description": "Understand variables, functions, arrays, objects, and DOM basics.",
    "resources": "MDN Web Docs, freeCodeCamp",
    "duration": "1 week"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = cleanJsonText(response.text || "[]");
    return JSON.parse(text);
  } catch (error) {
    console.error("Roadmap AI Error:", error);

    return [
      {
        title: "Strengthen Fundamentals",
        description:
          "Start by improving your basics and understanding the core concepts required for your goal.",
        resources: "YouTube tutorials, official documentation, freeCodeCamp",
        duration: "1-2 weeks",
      },
      {
        title: "Build Practice Projects",
        description:
          "Create small projects to apply what you learn and improve confidence.",
        resources: "GitHub, frontend practice websites, documentation",
        duration: "2-3 weeks",
      },
      {
        title: "Prepare for Internships",
        description:
          "Improve your resume, GitHub profile, LinkedIn, and practice interview questions.",
        resources: "LinkedIn, GitHub, resume templates, interview guides",
        duration: "1 week",
      },
    ];
  }
}

export async function generateResumeCritiqueAI(
  resumeText: string,
  targetRole: string
) {
  const prompt = `
You are a recruiter reviewing a student resume.

Target Role: ${targetRole || "Software Engineering Intern"}

Resume:
${resumeText}

Return ONLY valid JSON in this format:
{
  "score": 75,
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "advice": ["action 1", "action 2"],
  "formatted_feedback": "short markdown-style feedback"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = cleanJsonText(response.text || "{}");
    return JSON.parse(text);
  } catch (error) {
    console.error("Resume AI Error:", error);

    return {
      score: 70,
      strengths: [
        "Good project-based profile",
        "Relevant technical skills are included",
      ],
      weaknesses: [
        "Resume can be more result-oriented",
        "Projects need stronger impact statements",
      ],
      advice: [
        "Add measurable outcomes to projects",
        "Keep resume ATS-friendly and one page",
        "Add GitHub and live project links",
      ],
      formatted_feedback:
        "Your resume has a good foundation. Improve it by adding measurable project impact, stronger keywords, and clear links to GitHub or live projects.",
    };
  }
}
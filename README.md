# StudyPath AI Pro – Career & Study Companion

A professional career and study companion built for B.Tech students to plan roadmaps, track skills, and prepare for internships.

## Project Story
"Built by a student for students – This project helps students plan their learning and career journey step by step."

## Features
- **AI Roadmap Generator:** Customized career paths powered by Gemini 3 Flash.
- **Study Planner:** Daily and weekly task management with priority levels.
- **Skill Tracker:** Visual proficiency matrix to track your technical growth.
- **Knowledge Archives:** Categorized notes section for learning insights.
- **Pipeline Tracker:** Track internship applications and statuses.
- **Assignment Tracker:** Monitor deadlines and project submissions.
- **Resource Library:** Curated links for DSA, System Design, and Interview prep.

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS 4 + Framer Motion
- **Backend:** Node.js + Express
- **Database:** SQLite (Better-SQLite3)
- **Auth:** JWT + Bcrypt
- **AI:** Google Gemini API

## Setup Steps
1. Install dependencies: `npm install`
2. Configure `.env`: Add your `GEMINI_API_KEY`.
3. Start the application: `npm run dev`
4. Access the app at `http://localhost:3000`.

## Architecture
- `/server`: Express API with custom middleware and SQLite database.
- `/src`: React frontend with full routing and state management.

import express from 'express';
import db from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(authenticateToken);

// Roadmaps
router.post('/', (req: AuthRequest, res) => {
  const { goal, skills, roadmap } = req.body;
  const userId = req.user?.id;

  try {
    const id = uuidv4();
    db.prepare('INSERT INTO roadmaps (id, userId, goal, skills, roadmap) VALUES (?, ?, ?, ?, ?)').run(
      id,
      userId,
      goal,
      skills,
      JSON.stringify(roadmap)
    );
    res.status(201).json({ id, goal, skills, roadmap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save roadmap' });
  }
});

router.get('/', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const roadmaps = db.prepare('SELECT * FROM roadmaps WHERE userId = ? ORDER BY createdAt DESC').all(userId) as any[];
    res.json(roadmaps.map(r => ({ ...r, roadmap: JSON.parse(r.roadmap) })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

export default router;

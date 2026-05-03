import express from 'express';
import db from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(authenticateToken);

// Tasks
router.get('/tasks', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY date ASC').all(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/tasks', (req: AuthRequest, res) => {
  const { title, date, priority } = req.body;
  const userId = req.user?.id;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO tasks (id, userId, title, date, priority) VALUES (?, ?, ?, ?, ?)').run(
      id, userId, title, date, priority
    );
    res.status(201).json({ id, title, date, priority, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/tasks/:id', (req: AuthRequest, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    db.prepare('UPDATE tasks SET status = ? WHERE id = ? AND userId = ?').run(status, id, userId);
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Skills
router.get('/skills', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const skills = db.prepare('SELECT * FROM skills WHERE userId = ?').all(userId);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', (req: AuthRequest, res) => {
  const { name, progress } = req.body;
  const userId = req.user?.id;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO skills (id, userId, name, progress) VALUES (?, ?, ?, ?)').run(
      id, userId, name, progress || 0
    );
    res.status(201).json({ id, name, progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

router.patch('/skills/:id', (req: AuthRequest, res) => {
  const { progress } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    db.prepare('UPDATE skills SET progress = ? WHERE id = ? AND userId = ?').run(progress, id, userId);
    res.json({ message: 'Skill updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Notes
router.get('/notes', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const notes = db.prepare('SELECT * FROM notes WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/notes', (req: AuthRequest, res) => {
  const { title, category, content } = req.body;
  const userId = req.user?.id;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO notes (id, userId, title, category, content) VALUES (?, ?, ?, ?, ?)').run(
      id, userId, title, category, content
    );
    res.status(201).json({ id, title, category, content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Assignments
router.get('/assignments', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const assignments = db.prepare('SELECT * FROM assignments WHERE userId = ? ORDER BY deadline ASC').all(userId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.post('/assignments', (req: AuthRequest, res) => {
  const { title, deadline, subject } = req.body;
  const userId = req.user?.id;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO assignments (id, userId, title, deadline, subject) VALUES (?, ?, ?, ?, ?)').run(
      id, userId, title, deadline, subject
    );
    res.status(201).json({ id, title, deadline, subject, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add assignment' });
  }
});

router.patch('/assignments/:id', (req: AuthRequest, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    db.prepare('UPDATE assignments SET status = ? WHERE id = ? AND userId = ?').run(status, id, userId);
    res.json({ message: 'Assignment updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Internships
router.get('/internships', (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const internships = db.prepare('SELECT * FROM internships WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

router.post('/internships', (req: AuthRequest, res) => {
  const { company, role, status } = req.body;
  const userId = req.user?.id;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO internships (id, userId, company, role, status) VALUES (?, ?, ?, ?, ?)').run(
      id, userId, company, role, status || 'applied'
    );
    res.status(201).json({ id, company, role, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add internship application' });
  }
});

export default router;

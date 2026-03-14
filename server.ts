import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';

const db = new Database('app.db');

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS writing_exercises (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS classrooms (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  const setupCrud = (table: string, pathName: string) => {
    app.get(`/api/${pathName}`, (req, res) => {
      try {
        const rows = db.prepare(`SELECT data FROM ${table}`).all();
        res.json(rows.map((r: any) => JSON.parse(r.data)));
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post(`/api/${pathName}`, (req, res) => {
      try {
        const item = req.body;
        if (!item.id) {
          return res.status(400).json({ error: 'Item must have an id' });
        }
        db.prepare(`INSERT OR REPLACE INTO ${table} (id, data) VALUES (?, ?)`).run(item.id, JSON.stringify(item));
        res.json({ success: true, item });
      } catch (error) {
        console.error(`Error saving to ${table}:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete(`/api/${pathName}/:id`, (req, res) => {
      try {
        db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
        res.json({ success: true });
      } catch (error) {
        console.error(`Error deleting from ${table}:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  };

  setupCrud('assignments', 'assignments');
  setupCrud('progress', 'progress');
  setupCrud('writing_exercises', 'writing-exercises');
  setupCrud('lessons', 'lessons');
  setupCrud('students', 'students');
  setupCrud('classrooms', 'classrooms');

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

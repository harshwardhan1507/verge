import express from 'express';
import { db } from '../db.js';

export const peopleRouter = express.Router();

const listPeopleStmt = db.prepare(`
  SELECT p.id, p.name, COUNT(ep.entry_id) AS entry_count
  FROM people p
  LEFT JOIN entry_people ep ON ep.person_id = p.id
  GROUP BY p.id, p.name
  ORDER BY p.name COLLATE NOCASE ASC
`);

const entriesForPersonStmt = db.prepare(`
  SELECT e.*
  FROM entries e
  JOIN entry_people ep ON ep.entry_id = e.id
  WHERE ep.person_id = ?
  ORDER BY datetime(e.created_at) DESC
`);

peopleRouter.get('/', (_req, res) => {
  const rows = listPeopleStmt.all();
  res.json(rows);
});

peopleRouter.get('/:id/entries', (req, res) => {
  const id = Number(req.params.id);
  const rows = entriesForPersonStmt.all(id);
  res.json(rows);
});


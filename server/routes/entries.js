import express from 'express';
import { db, upsertPeopleForEntry } from '../db.js';

export const entriesRouter = express.Router();

const listEntriesStmt = db.prepare(`
  SELECT * FROM entries
  ORDER BY datetime(created_at) DESC
`);

const getEntryByIdStmt = db.prepare(`
  SELECT * FROM entries WHERE id = ?
`);

const insertEntryStmt = db.prepare(`
  INSERT INTO entries (content, title, type, people, created_at, is_resolved)
  VALUES (@content, @title, @type, @people, @created_at, @is_resolved)
`);

const deleteEntryStmt = db.prepare(`
  DELETE FROM entries WHERE id = ?
`);

const resolveEntryStmt = db.prepare(`
  UPDATE entries
  SET is_resolved = 1
  WHERE id = ?
`);

const unresolvedEntriesStmt = db.prepare(`
  SELECT * FROM entries
  WHERE is_resolved = 0
  ORDER BY datetime(created_at) DESC
`);

const worthRevisitingStmt = db.prepare(`
  SELECT * FROM entries
  WHERE is_resolved = 0
    AND datetime(created_at) <= datetime('now', '-4 hours')
  ORDER BY RANDOM()
  LIMIT 5
`);

entriesRouter.get('/', (_req, res) => {
  const rows = listEntriesStmt.all();
  res.json(rows);
});

entriesRouter.get('/unresolved', (_req, res) => {
  const rows = unresolvedEntriesStmt.all();
  res.json(rows);
});

entriesRouter.get('/worth-revisiting', (_req, res) => {
  const rows = worthRevisitingStmt.all();
  res.json(rows);
});

entriesRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = getEntryByIdStmt.get(id);
  if (!row) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  res.json(row);
});

entriesRouter.post('/', (req, res) => {
  const { content, title, type, people = [], is_resolved = false } = req.body ?? {};

  if (!content || !title || !type) {
    res.status(400).json({ error: 'content, title, and type are required' });
    return;
  }

  if (!['Event', 'Emotion', 'Commitment', 'Thought'].includes(type)) {
    res.status(400).json({ error: 'Invalid type' });
    return;
  }

  const createdAt = new Date().toISOString();
  const peopleArray = Array.isArray(people) ? people : [];

  const info = insertEntryStmt.run({
    content,
    title,
    type,
    people: JSON.stringify(peopleArray),
    created_at: createdAt,
    is_resolved: is_resolved ? 1 : 0,
  });

  if (peopleArray.length > 0) {
    upsertPeopleForEntry(info.lastInsertRowid, peopleArray);
  }

  const created = getEntryByIdStmt.get(info.lastInsertRowid);
  res.status(201).json(created);
});

entriesRouter.patch('/:id/resolve', (req, res) => {
  const id = Number(req.params.id);
  const existing = getEntryByIdStmt.get(id);
  if (!existing) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }

  resolveEntryStmt.run(id);
  const updated = getEntryByIdStmt.get(id);
  res.json(updated);
});

entriesRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = getEntryByIdStmt.get(id);
  if (!existing) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }

  deleteEntryStmt.run(id);
  res.status(204).end();
});


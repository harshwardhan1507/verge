import express from 'express';
import { db } from '../db.js';

export const statsRouter = express.Router();

const unresolvedCountStmt = db.prepare(`
  SELECT COUNT(*) AS count
  FROM entries
  WHERE is_resolved = 0
`);

const unresolvedCommitmentsStmt = db.prepare(`
  SELECT COUNT(*) AS count
  FROM entries
  WHERE is_resolved = 0
    AND type = 'Commitment'
`);

const recentEntriesStmt = db.prepare(`
  SELECT *
  FROM entries
  ORDER BY datetime(created_at) DESC
  LIMIT 50
`);

statsRouter.get('/', (_req, res) => {
  const unresolved = unresolvedCountStmt.get().count;
  const commitments = unresolvedCommitmentsStmt.get().count;
  const recent = recentEntriesStmt.all();

  res.json({
    unresolved,
    commitments,
    recent,
  });
});


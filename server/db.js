import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'memoryos.db');

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Event', 'Emotion', 'Commitment', 'Thought')),
    people TEXT DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_resolved INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS entry_people (
    entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, person_id)
  );
`);

export function upsertPeopleForEntry(entryId, peopleNames) {
  const insertPerson = db.prepare(`
    INSERT OR IGNORE INTO people (name) VALUES (?)
  `);
  const getPerson = db.prepare(`
    SELECT id FROM people WHERE name = ?
  `);
  const linkPerson = db.prepare(`
    INSERT OR IGNORE INTO entry_people (entry_id, person_id) VALUES (?, ?)
  `);

  const txn = db.transaction((names) => {
    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      insertPerson.run(trimmed);
      const person = getPerson.get(trimmed);
      if (person) {
        linkPerson.run(entryId, person.id);
      }
    }
  });

  txn(peopleNames);
}


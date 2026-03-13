import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { entriesRouter } from './routes/entries.js';
import { peopleRouter } from './routes/people.js';
import { statsRouter } from './routes/stats.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: false,
  }),
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/entries', entriesRouter);
app.use('/api/people', peopleRouter);
app.use('/api/stats', statsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MemoryOS API listening on http://localhost:${PORT}`);
});


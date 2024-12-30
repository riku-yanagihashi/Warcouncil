import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL接続プール
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectWithRetry = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection failed, retrying in 5 seconds...', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

app.use(express.json());

// テスト用エンドポイント
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

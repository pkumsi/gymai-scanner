BEGIN;

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  date TEXT,
  exercise TEXT,
  reps INTEGER,
  weight REAL
);

CREATE TABLE IF NOT EXISTS workout_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  created_at TEXT,
  level TEXT,
  duration INTEGER,
  goals TEXT,        -- JSON-encoded array
  plan TEXT          -- the GPT response
);

COMMIT;

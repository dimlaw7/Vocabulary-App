export async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      word TEXT NOT NULL,
      definition TEXT NOT NULL,
      example TEXT,
      pronunciation TEXT,
      language TEXT NOT NULL DEFAULT 'English',

      repetitions INTEGER NOT NULL DEFAULT 0,
      interval INTEGER NOT NULL DEFAULT 0,
      ease_factor REAL NOT NULL DEFAULT 2.5,

      next_review_at TEXT,
      last_reviewed_at TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

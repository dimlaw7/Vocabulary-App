export async function createWord(db, wordData) {
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `
      INSERT INTO words (
        word,
        definition,
        example,
        pronunciation,
        language,
        repetitions,
        interval,
        ease_factor,
        next_review_at,
        last_reviewed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    wordData.word,
    wordData.definition,
    wordData.example || null,
    wordData.pronunciation || null,
    wordData.language || "English",
    0,
    0,
    2.5,
    null,
    null,
    now,
    now,
  );

  return result.lastInsertRowId;
}

export async function getWords(db) {
  return await db.getAllAsync(`
    SELECT *
    FROM words
    ORDER BY created_at DESC
  `);
}

export async function getWord(db, id) {
  return await db.getFirstAsync(
    `
      SELECT *
      FROM words
      WHERE id = ?
    `,
    id,
  );
}

export async function updateWord(db, id, wordData) {
  const now = new Date().toISOString();

  await db.runAsync(
    `
      UPDATE words
      SET
        word = ?,
        definition = ?,
        example = ?,
        pronunciation = ?,
        language = ?,
        updated_at = ?
      WHERE id = ?
    `,
    wordData.word,
    wordData.definition,
    wordData.example || null,
    wordData.pronunciation || null,
    wordData.language || "English",
    now,
    id,
  );
}

export async function deleteWord(db, id) {
  await db.runAsync(
    `
      DELETE FROM words
      WHERE id = ?
    `,
    id,
  );
}

export async function updateWordLearningState(db, id, learningState) {
  const now = new Date().toISOString();

  await db.runAsync(
    `
      UPDATE words
      SET
        repetitions = ?,
        interval = ?,
        ease_factor = ?,
        next_review_at = ?,
        last_reviewed_at = ?,
        updated_at = ?
      WHERE id = ?
    `,
    learningState.repetitions,
    learningState.interval,
    learningState.easeFactor,
    learningState.nextReviewAt,
    now,
    now,
    id,
  );
}

export async function getWordsForPractice(db) {
  return await db.getAllAsync(`
    SELECT *
    FROM words
    WHERE
      next_review_at IS NULL
      OR next_review_at <= datetime('now')
    ORDER BY
      CASE
        WHEN next_review_at IS NULL THEN 0
        ELSE 1
      END,
      next_review_at ASC,
      created_at ASC
  `);
}

export async function getDueWords(db) {
  return await db.getAllAsync(
    `
    SELECT *
    FROM words
    WHERE
      next_review_at IS NULL
      OR next_review_at <= ?
    ORDER BY
      CASE
        WHEN next_review_at IS NULL THEN 0
        ELSE 1
      END,
      next_review_at ASC,
      created_at ASC
  `,
    new Date().toISOString(),
  );
}

export async function getWordCounts(db) {
  const now = new Date().toISOString();

  const totalResult = await db.getFirstAsync(`
    SELECT COUNT(*) AS count
    FROM words
  `);

  const dueResult = await db.getFirstAsync(
    `
      SELECT COUNT(*) AS count
      FROM words
      WHERE
        next_review_at IS NULL
        OR next_review_at <= ?
    `,
    now,
  );

  const newResult = await db.getFirstAsync(`
    SELECT COUNT(*) AS count
    FROM words
    WHERE repetitions = 0
  `);

  return {
    total: totalResult.count,
    due: dueResult.count,
    newWords: newResult.count,
  };
}

export async function CreateWord(db, wordData) {
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

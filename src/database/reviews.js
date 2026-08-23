export async function createReview(db, reviewData) {
  const reviewedAt = new Date().toISOString();

  const result = await db.runAsync(
    `
      INSERT INTO reviews (
        word_id,
        result,
        hints_used,
        response_time_ms,
        reviewed_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    reviewData.wordId,
    reviewData.result,
    reviewData.hintsUsed || 0,
    reviewData.responseTimeMs || null,
    reviewedAt,
  );

  return result.lastInsertRowId;
}

export async function getReviewsForWord(db, wordId) {
  return await db.getAllAsync(
    `
      SELECT *
      FROM reviews
      WHERE word_id = ?
      ORDER BY reviewed_at DESC
    `,
    wordId,
  );
}

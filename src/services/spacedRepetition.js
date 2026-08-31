const MIN_EASE_FACTOR = 1.3;

export function calculateNextReview({
  repetitions,
  interval,
  easeFactor,
  result,
}) {
  let nextRepetitions = repetitions;
  let nextInterval = interval;
  let nextEaseFactor = easeFactor;

  if (result === "forgot") {
    nextRepetitions = 0;
    nextInterval = 1;

    nextEaseFactor = Math.max(MIN_EASE_FACTOR, nextEaseFactor - 0.2);
  }

  if (result === "hint") {
    nextRepetitions += 1;

    if (nextRepetitions === 1) {
      nextInterval = 1;
    } else {
      nextInterval = Math.max(1, Math.round(nextInterval * 1.5));
    }

    nextEaseFactor = Math.max(MIN_EASE_FACTOR, nextEaseFactor - 0.1);
  }

  if (result === "recalled") {
    nextRepetitions += 1;

    if (nextRepetitions === 1) {
      nextInterval = 1;
    } else if (nextRepetitions === 2) {
      nextInterval = 3;
    } else {
      nextInterval = Math.max(1, Math.round(nextInterval * nextEaseFactor));
    }

    nextEaseFactor += 0.1;
  }

  const nextReviewAt = new Date();

  nextReviewAt.setDate(nextReviewAt.getDate() + nextInterval);

  return {
    repetitions: nextRepetitions,
    interval: nextInterval,
    easeFactor: nextEaseFactor,
    nextReviewAt: nextReviewAt.toISOString(),
  };
}

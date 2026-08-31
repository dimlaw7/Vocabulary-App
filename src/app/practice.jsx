import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createReview } from "../database/reviews";
import { getDueWords, updateWordLearningState } from "../database/words";
import { calculateNextReview } from "../services/spacedRepetition";

export default function PracticeScreen() {
  const db = useSQLiteContext();

  const [word, setWord] = useState(null);
  const [answer, setAnswer] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const startedAt = useRef(Date.now());

  useEffect(() => {
    loadWord();
  }, []);

  async function loadWord() {
    try {
      setLoading(true);

      const words = await getDueWords(db);

      if (words.length === 0) {
        setWord(null);
        return;
      }

      // For now, simply practice the first word.
      const selectedWord = words[0];

      setWord(selectedWord);
      setAnswer("");
      setHintLevel(0);
      setResult(null);
      startedAt.current = Date.now();
    } catch (error) {
      console.error("Failed to load practice word:", error);
    } finally {
      setLoading(false);
    }
  }

  function getHint() {
    if (!word) return;

    setHintLevel((current) => Math.min(current + 1, 2));
  }

  function getHintText() {
    if (!word || hintLevel === 0) {
      return null;
    }

    if (hintLevel === 1) {
      return `Starts with "${word.word.charAt(0)}"`;
    }

    return word.word
      .split("")
      .map((character, index) => {
        if (index === 0 || index === word.word.length - 1) {
          return character;
        }

        return "_";
      })
      .join(" ");
  }

  async function checkAnswer() {
    if (!word || !answer.trim()) {
      return;
    }

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedWord = word.word.trim().toLowerCase();

    const correct = normalizedAnswer === normalizedWord;

    const reviewResult = correct
      ? hintLevel === 0
        ? "recalled"
        : "hint"
      : "forgot";

    const responseTimeMs = Date.now() - startedAt.current;

    try {
      await createReview(db, {
        wordId: word.id,
        result: reviewResult,
        hintsUsed: hintLevel,
        responseTimeMs,
      });

      const nextLearningState = calculateNextReview({
        repetitions: word.repetitions,
        interval: word.interval,
        easeFactor: word.ease_factor,
        result: reviewResult,
      });

      await updateWordLearningState(db, word.id, nextLearningState);

      setResult(reviewResult);
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!word) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No words yet</Text>

        <Text style={styles.emptyText}>
          Add some words before starting a review.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/add-word")}
        >
          <Text style={styles.buttonText}>Add Word</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Practice</Text>
      <Text>{result}</Text>

      <Text style={styles.question}>What word means:</Text>

      <Text style={styles.definition}>"{word.definition}"</Text>

      {word.example ? (
        <Text style={styles.example}>Example: "{word.example}"</Text>
      ) : null}

      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Type the word..."
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        onSubmitEditing={checkAnswer}
      />

      <Pressable style={styles.button} onPress={checkAnswer}>
        <Text style={styles.buttonText}>Check</Text>
      </Pressable>

      <>
        {hintLevel > 0 && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintLabel}>Hint</Text>

            <Text style={styles.hint}>{getHintText()}</Text>
          </View>
        )}

        {hintLevel < 2 && (
          <Pressable style={styles.hintButton} onPress={getHint}>
            <Text style={styles.hintButtonText}>
              {hintLevel === 0 ? "Give me a hint" : "Give me another hint"}
            </Text>
          </Pressable>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  progress: {
    textAlign: "center",
    color: "#777",
    marginBottom: 50,
  },

  question: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  definition: {
    fontSize: 24,
    lineHeight: 34,
    textAlign: "center",
    marginTop: 16,
  },

  example: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginTop: 40,
  },

  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  hintButton: {
    alignItems: "center",
    padding: 16,
    marginTop: 12,
  },

  hintButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  hintContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },

  hintLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
  },

  hint: {
    fontSize: 18,
    marginTop: 6,
    letterSpacing: 2,
  },

  resultTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },

  word: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    marginTop: 8,
    textAlign: "center",
  },
});

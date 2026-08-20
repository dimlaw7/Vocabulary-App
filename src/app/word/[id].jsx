import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { deleteWord, getWord } from "../../database/words";

export default function WordDetailsScreen() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWord() {
      try {
        const result = await getWord(db, Number(id));

        setWord(result);
      } catch (error) {
        console.error("Failed to load word:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWord();
  }, [db, id]);

  async function handleDelete() {
    Alert.alert(
      "Delete word",
      `Are you sure you want to delete "${word.word}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWord(db, Number(id));

              router.back();
            } catch (error) {
              console.error("Failed to delete word:", error);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!word) {
    return (
      <View>
        <Text>Word not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.word}>{word.word}</Text>

      {word.pronunciation ? (
        <Text style={styles.pronunciation}>{word.pronunciation}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Definition</Text>

      <Text style={styles.definition}>{word.definition}</Text>

      {word.example ? (
        <>
          <Text style={styles.sectionTitle}>Example</Text>

          <Text style={styles.example}>"{word.example}"</Text>
        </>
      ) : null}

      <View style={styles.learningCard}>
        <Text style={styles.sectionTitle}>Learning</Text>

        <Text style={styles.status}>New</Text>

        <Text style={styles.learningText}>
          This word has not been reviewed yet.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  word: {
    fontSize: 36,
    fontWeight: "700",
  },

  pronunciation: {
    fontSize: 16,
    color: "#777",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 8,
  },

  definition: {
    fontSize: 18,
    lineHeight: 27,
  },

  example: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },

  learningCard: {
    marginTop: 28,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },

  status: {
    fontSize: 18,
    fontWeight: "600",
  },

  learningText: {
    color: "#666",
    marginTop: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },

  editButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  editText: {
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#111",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});

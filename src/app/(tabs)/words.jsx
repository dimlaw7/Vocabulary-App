import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getWords } from "../../database/words";

export default function WordsScreen() {
  const db = useSQLiteContext();

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getWords(db);

      setWords(result);
    } catch (error) {
      console.error("Failed to load words:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [loadWords]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Words</Text>

      {words.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No words yet</Text>

          <Text style={styles.emptyText}>Words you save will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.wordCard}>
              <Text style={styles.word}>{item.word}</Text>

              <Text style={styles.definition} numberOfLines={2}>
                {item.definition}
              </Text>

              {item.example ? (
                <Text style={styles.example} numberOfLines={1}>
                  {item.example}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
  },

  list: {
    paddingBottom: 24,
  },

  wordCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    marginBottom: 12,
  },

  word: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  definition: {
    fontSize: 15,
    color: "#444",
    lineHeight: 21,
  },

  example: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    marginTop: 8,
  },

  empty: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  emptyText: {
    color: "#777",
    marginTop: 8,
  },
});

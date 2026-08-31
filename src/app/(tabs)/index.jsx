import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getWordCounts } from "../../database/words";

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [counts, setCounts] = useState({
    total: 0,
    due: 0,
    newWords: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getWordCounts(db);

      setCounts(result);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Your Vocabulary</Text>

      <Text style={styles.subtitle}>
        Keep turning passive vocabulary into active vocabulary.
      </Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewNumber}>{loading ? "—" : counts.due}</Text>

        <Text style={styles.reviewLabel}>Reviews due</Text>

        <Pressable
          style={styles.reviewButton}
          onPress={() => router.push("/practice")}
          disabled={counts.due === 0}
        >
          <Text style={styles.reviewButtonText}>
            {counts.due > 0 ? "Start Review" : "You're all caught up"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{counts.total}</Text>

          <Text style={styles.statLabel}>Total words</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{counts.newWords}</Text>

          <Text style={styles.statLabel}>New words</Text>
        </View>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add-word")}
      >
        <Text style={styles.addButtonText}>+ Add Word</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  greeting: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 30,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 23,
    marginTop: 8,
  },

  reviewCard: {
    marginTop: 35,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },

  reviewNumber: {
    fontSize: 48,
    fontWeight: "700",
  },

  reviewLabel: {
    fontSize: 16,
    color: "#666",
  },

  reviewButton: {
    width: "100%",
    marginTop: 22,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
  },

  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },

  statLabel: {
    color: "#666",
    marginTop: 4,
  },

  addButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

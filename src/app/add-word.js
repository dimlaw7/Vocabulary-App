import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createWord } from "../database/words";

export default function AddWordScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!word.trim() || !definition.trim()) {
      return;
    }

    try {
      setSaving(true);

      await createWord(db, {
        word: word.trim(),
        definition: definition.trim(),
        example: example.trim(),
        pronunciation: pronunciation.trim(),
        language: "English",
      });

      router.back();
    } catch (error) {
      console.error("Failed to save word:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Word</Text>

      <Text style={styles.label}>Word</Text>

      <TextInput
        value={word}
        onChangeText={setWord}
        placeholder="e.g Ambition"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Definition</Text>

      <TextInput
        value={definition}
        onChangeText={setDefinition}
        placeholder="What does it mean?"
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.label}>Example Sentence</Text>

      <TextInput
        value={example}
        onChangeText={setExample}
        placeholder="Use the word in a sentence"
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.label}>Pronunciation</Text>

      <TextInput
        value={pronunciation}
        onChangeText={setPronunciation}
        placeholder="Optional"
        style={styles.input}
      />

      <Pressable onPress={handleSave} disabled={saving} style={styles.button}>
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Save Word"}
        </Text>
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

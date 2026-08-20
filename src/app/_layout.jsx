import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../database/schema";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="vocabulary.db" onInit={initializeDatabase}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-word"
          options={{
            title: "Add Word",
            presentation: "modal",
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}

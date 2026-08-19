import * as SQLite from "expo-sqlite";
import { initializeDatabase } from "./schema";

export async function initializeDatabaseConnection() {
  const db = await SQLite.openDatabaseAsync("vocabulary.db");

  await initializeDatabase(db);

  return db;
}

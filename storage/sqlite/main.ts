import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

// 打开数据库连接
const sqLiteDatabase: SQLiteDatabase = openDatabaseSync("playlist");

export const db = drizzle(sqLiteDatabase);

import { SQLocalDrizzle } from "sqlocal/drizzle";
import { drizzle } from "drizzle-orm/sqlite-proxy";

const { driver, batchDriver } = new SQLocalDrizzle("database.db");
export const db = drizzle(driver, batchDriver);

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
sqlite3.verbose();

let db;

export async function ensure_db() {
    if(!db) {
        db = await open(
            {
                filename: "./main.db",
                driver: sqlite3.Database
            }
        )
        await db.exec(
            "CREATE TABLE IF NOT EXISTS tokens (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);"
        )
    }
}

export async function select(text, args) {
    await ensure_db();
    return await db.get(text, args);
}

export async function insert_raw(text, args) {
    await ensure_db();
    return await db.exec(text, args)
}

export async function close() {
    if(!!db) {
        await db.close();
    }
}

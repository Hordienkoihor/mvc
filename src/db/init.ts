import {readFile} from "node:fs/promises";
import type {Pool} from "mysql2/promise";
import {fileURLToPath} from "node:url";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDb(pool: Pool) {
    try {
        const dbQuery = await readFile(path.join(__dirname, '../../src/db/initDb.sql'), 'utf8');
        await pool.query(dbQuery)

        await pool.query(`USE mvc_db`)

        const authorQuery = await readFile(path.join(__dirname, '../../src/db/initAuthor.sql'), 'utf8');
        await pool.query(authorQuery)

        const booksQuery = await readFile(path.join(__dirname, '../../src/db/initBooks.sql'), 'utf8');
        await pool.query(booksQuery)

        const junction = await readFile(path.join(__dirname, '../../src/db/initAuthorBook.sql'), 'utf8');
        await pool.query(junction)
    } catch (err) {
        console.error(err);
    }
}
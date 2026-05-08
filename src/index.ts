import express from "express"
import {config} from 'dotenv'
import {fileURLToPath} from 'node:url'
import * as path from "node:path";
import mysql from 'mysql2/promise';
import {initDb} from "./db/init.js"
import {dbPool} from "./config/database.js";


config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fallDownPort = 3000
const app = express()

app.use(express.json())

// initializing db
await initDb(dbPool)

// static
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/books/books-page/books-page.html'))
})
app.use('/books/:book_id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/books/books-page/books-page.html'))
})

app.listen(process.env.PORT || fallDownPort, () => {
    console.log(`Listening on port ${process.env.PORT || fallDownPort}`)
})
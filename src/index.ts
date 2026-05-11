import express from "express"
import {config} from 'dotenv'
import {fileURLToPath} from 'node:url'
import * as path from "node:path";
import mysql from 'mysql2/promise';
import {initDb} from "./db/init.js"
import {dbPool} from "./config/database.js";
import {UserRouter} from "./router/userRouter.js";
import {BookRepository} from "./repository/bookRepository.js";
import {BookService} from "./service/bookService.js";
import {JunctionRepository} from "./repository/junctionRepository.js";


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


app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

const bookRepository = new BookRepository(dbPool);
const junctionRepository = new JunctionRepository(dbPool);
const bookService = new BookService(bookRepository, junctionRepository);
const userRouter = new UserRouter(bookService);

app.use('/', userRouter.getRouter())


// // routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/books/books-page/books-page.html'))
// })
// app.use('/books/:book_id', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/books/books-page/books-page.html'))
// })

app.listen(process.env.PORT || fallDownPort, () => {
    console.log(`Listening on port ${process.env.PORT || fallDownPort}`)
})
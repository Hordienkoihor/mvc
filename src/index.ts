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
import {AdminRouter} from "./router/admin/adminRouter.js";
import {AuthorRepository} from "./repository/authorRepository.js";
import {AuthorService} from "./service/authorService.js";
import {BookViewsRepository} from "./repository/bookViewsRepository.js";


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
const authorRepository = new AuthorRepository(dbPool);
const bookViewsRepository = new BookViewsRepository(dbPool);
const bookService = new BookService(bookRepository, junctionRepository, bookViewsRepository);
const userRouter = new UserRouter(bookService);
const authorService = new AuthorService(authorRepository);

app.use('/', userRouter.getRouter())

/* test admin page router */

const adminRouter = new AdminRouter(authorService, bookService);
app.use('/admin', adminRouter.getRouter())


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
import type {AuthorService} from "../service/authorService.js";
import type {BookService} from "../service/bookService.js";
import express, {type Router} from "express";
import type {Request, Response} from "express";
import type {Book} from "../types/book.type.js";
import multer, {type Multer} from "multer"
import type {BookDto} from "../dto/book.dto.js";
import type {AuthorDto} from "../dto/author.dto.js";
import basicAuth from "express-basic-auth";

export class AdminRouter {
    private readonly router: Router;
    private readonly multer: Multer;
    private readonly uploadBook;
    // private readonly uploadBooks;

    private storageBook = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/images");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })

    // private storageBooks = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, "public/books/books-page/books-page_files");
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.originalname);
    //     }
    // })

    constructor(private readonly authorService: AuthorService, private readonly bookService: BookService) {
        this.router = express.Router();

        this.router.use(basicAuth({
            users: {
                'librarian': 'lkey',
                'logout': 'working'
            },
            challenge: true

        }))

        this.multer = multer({dest: 'public/uploads'})

        this.uploadBook = multer({storage: this.storageBook})
        // this.uploadBooks = multer({storage: this.storageBooks})

        this.setupRoutes()
    }

    private setupRoutes(): void {
        this.router.get("/", this.getDefault.bind(this))
        this.router.post("/api/v1/book/add-book", this.uploadBook.single('img'), this.addBook.bind(this))
        this.router.delete("/api/v1/book/delete-book", this.deleteBook.bind(this))
        this.router.post("/api/v1/author/add-author", this.addAuthor.bind(this))
        this.router.get("/logout", this.logout.bind(this))
    }

    private async getDefault(req: Request, res: Response) {
        const bookFetchResult = await this.bookService.getAll()

        if (!bookFetchResult.success) {
            return res.status(401).json({message: bookFetchResult.msg})
        }

        const authorFetchResult = await this.authorService.getAll()

        if (!authorFetchResult.success) {
            return res.status(401).json({message: authorFetchResult.msg})
        }

        const books = bookFetchResult.books
        const authors = authorFetchResult.authors

        res.render('admin-page', {
            authors,
            books,
        })

    }

    public async addBook(req: Request, res: Response) {
        const book = req.body as Book

        if (!book.author) {
            return res.status(400).json({message: "No author specified"})
        }

        const fileDat = req.file

        if (!fileDat) {
            return res.status(400).json({message: "No file uploaded"})
        }

        const authorId = book.author;

        const bookDto: BookDto = {
            name: book.name,
            description: book.description,
            image: fileDat.filename,
            author: authorId,
            year: book.year ? book.year : '2000',
        }

        const status = await this.bookService.add(bookDto, parseInt(authorId))

        if (!status.success) {
            return res.status(500).json({message: status.msg})
        }

        return res.status(200).json({success: true, id: status.id})
    }

    private async addAuthor(req: Request, res: Response) {
        const author = req.body as AuthorDto

        if (!author) {
            return res.status(400).json({message: "No author specified"})
        }

        const status = await this.authorService.add(author)

        if (!status.success) {
            return res.status(500).json({message: status.msg})
        }

        return res.status(200).json({success: true, id: status.id})
    }

    private async deleteBook(req: Request, res: Response) {
        const bookId = parseInt(req.body.id)

        if (!bookId) {
            return res.status(400).json({message: "No bookId specified"})
        }

        const status = await this.bookService.delete(bookId)

        if (!status.success) {
            return res.status(500).json({message: "internal server error"})
        }

        return res.status(200).json({message: "book deleted successfully"})

    }

    private async logout(req: Request, res: Response) {
        // delete req.headers['authorization']

        res.set('www-authenticate', 'Basic')

        return res.status(401).json({message: "logout successfully"})
    }

    public getRouter(): Router {
        return this.router;
    }

}
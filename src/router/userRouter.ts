import express, {type Router} from "express";
import type {getRequest} from "../types/getRequest.type.js";
import type {Request, Response} from "express";
import ejs from 'ejs'
import type {BookService} from "../service/bookService.js";
import type {JunctionRepository} from "../repository/junctionRepository.js";
import type {AuthorRepository} from "../repository/authorRepository.js";
import type {Author} from "../types/author.type.js";

export class UserRouter {
    private router: Router;

    constructor(readonly bookService: BookService) {
        this.router = express.Router()
        this.setupRoutes()
    }


    private setupRoutes() {
        this.router.get("/", this.getDefault.bind(this));
        this.router.get("/:id", this.getBookPage.bind(this));
    }


    public async getDefault(req: Request<{}, {}, {}, getRequest>, res: Response) {
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || "";
        const limit = 20;

        // if (search.length > 0) {
        //     const result =
        // } else {
        //     const result =
        // }

        const result = search.length > 0
            ? await this.bookService.searchInRange(offset, search)
            : await this.bookService.getInRange(offset)

        const books = result.books

        res.render('books-page', {
            books,
        })
    }

    public async getBookPage(req: Request<{id: string}, {}, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)

        if (!bookId) {
            return res.status(404).json({message: "Failed to parse an id: " + bookId})
        }

        console.log(bookId)
        const result = await this.bookService.getById(bookId)

        if (!result.success) {
            return res.status(404).json({message: "Not found book with id " + bookId})
        }

        const book = result.book

        res.render('book-page', {
            book,
        })
    }

    public getRouter() {
        return this.router;
    }
}



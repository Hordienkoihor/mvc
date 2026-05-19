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
        this.router.get("/books/:id", this.getBookPage.bind(this));
        this.router.get("/books/api/:id", this.getBookViews.bind(this));
        this.router.post("/books/api/:id", this.increaseViews.bind(this));
    }


    public async getDefault(req: Request<{}, {}, {}, getRequest>, res: Response) {
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || "";
        const year = req.query.year || "";
        const limit = 20;

        let result

        if (year.length > 0) {
            result = search.length > 0
                ? await this.bookService.searchInRangeWithYear(offset, search, year)
                : await this.bookService.getInRangeWithYear(offset, year)
        } else {
            result = search.length > 0
                ? await this.bookService.searchInRange(offset, search)
                : await this.bookService.getInRange(offset)
        }

        // if (search.length > 0) {
        //     const result =
        // } else {
        //     const result =
        // }

        const books = result.books

        res.render('books-page', {
            books,
        })
    }

    public async getBookPage(req: Request<{ id: string }, {}, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)

        if (!bookId) {
            return res.status(404).json({message: "Failed to parse an id: " + bookId})
        }

        const resultGet = await this.bookService.getById(bookId)

        if (!resultGet.success) {
            return res.status(404).json({message: "Not found book with id " + bookId})
        }

        const resultGetViews = await this.bookService.getViews(bookId)

        if (!resultGetViews.success) {
            return res.status(404).json({message: "can not fetch views for this book"})
        }

        const book = resultGet.book
        const views = resultGetViews.count
        res.render('book-page', {
            book,
            views
        })
    }

    public async getBookViews(req: Request<{ id: string }, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)

        if (!bookId) {
            return res.status(404).json({message: "Failed to parse an id: " + bookId})
        }

        const result = await this.bookService.getViews(bookId)
        if (!result.success) {
            return res.status(404).json({message: "Not found view with id " + bookId})
        }

        return res.status(200).json({
            views: result.count
        })
    }

    public async increaseViews(req: Request<{ id: string }, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)
        console.log(bookId)
        if (!bookId) {
            return res.status(404).json({message: "Failed to parse an id: " + bookId})
        }

        const result = await this.bookService.increaseViews(bookId)
        if (!result.success) {
            return res.status(404).json({message: "Not found view with id " + bookId})
        }

        return res.status(200).json({views: result.count})
    }

    public getRouter() {
        return this.router;
    }
}



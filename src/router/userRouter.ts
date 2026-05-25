import express, {type Router} from "express";
import type {getRequest} from "../types/getRequest.type.js";
import type {Request, Response} from "express";
import ejs from 'ejs'
import type {BookService} from "../service/bookService.js";
import type {JunctionRepository} from "../repository/junctionRepository.js";
import type {AuthorRepository} from "../repository/authorRepository.js";
import type {Author} from "../types/author.type.js";

/**
 * class provides endpoints for library
 * */
export class UserRouter {
    /*instance of express-router*/
    private readonly router: Router;

    /**
     * constructor
     * @bookService - instance of BookService
     * */
    constructor(readonly bookService: BookService) {
        this.router = express.Router()
        this.setupRoutes()
    }


    /**
     * links endpoints with corresponding methods
     * */
    private setupRoutes() {
        this.router.get("/", this.getDefault.bind(this));
        this.router.get("/books/:id", this.getBookPage.bind(this));
        this.router.get("/books/api/:id", this.getBookViews.bind(this));
        this.router.post("/books/api/:id", this.increaseViews.bind(this));
    }


    /**
     * method corresponding to '/' endpoint
     * renders main page of the library
     * */
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

        const books = result.books

        res.render('books-page', {
            books,
        })
    }

    /**
     * method corresponding to '/books/:id' endpoint
     *
     * @req - must contain book id in params
     * @res - renders  page of single book on success
     *        or status 401 if id was not specified
     *        or status 404 if no book with specified id was found
     * */
    public async getBookPage(req: Request<{ id: string }, {}, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)

        if (!bookId) {
            return res.status(404).json({error: "Failed to parse an id: " + bookId})
        }

        const resultGet = await this.bookService.getById(bookId)

        if (!resultGet.success) {
            return res.status(404).json({error: "Not found book with id " + bookId})
        }

        const resultGetViews = await this.bookService.getViews(bookId)

        if (!resultGetViews.success) {
            return res.status(404).json({error: "can not fetch views for this book"})
        }

        const book = resultGet.book
        const views = resultGetViews.count
        res.render('book-page', {
            book,
            views
        })
    }

    /**
     * method corresponding to '/books/api/:id' endpoint
     * METHOD GET
     * @req - must contain book id in params
     * @res - status 200 and views of specified book
     *        or status 401 if id was not specified
     *        or status 404 if no book with specified id was found
     * */
    public async getBookViews(req: Request<{ id: string }, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)

        if (!bookId) {
            return res.status(404).json({error: "Failed to parse an id: " + bookId})
        }

        const result = await this.bookService.getViews(bookId)
        if (!result.success) {
            return res.status(404).json({error: "Not found view with id " + bookId})
        }

        return res.status(200).json({
            views: result.count
        })
    }

    /**
     * method corresponding to '/books/api/:id' endpoint
     * METHOD POST
     * @req - must contain book id in params
     * @res - status 200 and increased by 1 views of specified book
     *        or status 401 if id was not specified
     *        or status 404 if no book with specified id was found
     * */
    public async increaseViews(req: Request<{ id: string }, {}, {}>, res: Response) {
        const bookId = parseInt(req.params.id)
        console.log(bookId)
        if (!bookId) {
            return res.status(404).json({error: "Failed to parse an id: " + bookId})
        }

        const result = await this.bookService.increaseViews(bookId)
        if (!result.success) {
            return res.status(404).json({error: "Not found view with id " + bookId})
        }

        return res.status(200).json({message: result.count})
    }

    /**
     * returns instance of express-router
     * */
    public getRouter() {
        return this.router;
    }
}



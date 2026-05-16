import type {AuthorService} from "../service/authorService.js";
import type {BookService} from "../service/bookService.js";
import express, {type Router} from "express";
import type {Request, Response} from "express";

export class AdminRouter {
    private readonly router: Router;

    constructor(private readonly authorService: AuthorService, private readonly bookService: BookService) {
        this.router = express.Router();
        this.setupRoutes()
    }

    private setupRoutes(): void {
        this.router.get("/", this.getDefault.bind(this))
    }

    private async getDefault(req: Request, res: Response) {
        const bookFetchResult = await this.bookService.getAll()

        if  (!bookFetchResult.success) {
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

    public getRouter(): Router {
        return this.router;
    }
}
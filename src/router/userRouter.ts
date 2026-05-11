import express, {type Router} from "express";
import type {getRequest} from "../types/getRequest.type.js";
import type {Request, Response} from "express";
import ejs from 'ejs'
import type {BookService} from "../service/bookService.js";

export class UserRouter {
    private router: Router;

    constructor(readonly bookService: BookService) {
        this.router = express.Router()
        this.setupRoutes()
    }


    private setupRoutes() {
        this.router.get("/", this.getDefault.bind(this));
    }


    public async getDefault(req: Request<{}, {}, {}, getRequest>, res: Response) {
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || "";
        const limit = 20;

        const result = await this.bookService.getInRange(offset)
        const books = result.books

        res.render('books-page', {
            books,
        })
    }

    public getRouter() {
        return this.router;
    }
}



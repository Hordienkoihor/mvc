import type {AuthorService} from "../../service/authorService.js";
import type {BookService} from "../../service/bookService.js";
import express, {type Router} from "express";
import type {Request, Response} from "express";
import type {Book} from "../../types/book.type.js";
import multer, {type Multer} from "multer"
import type {BookDto} from "../../dto/book.dto.js";
import type {AuthorDto} from "../../dto/author.dto.js";
import basicAuth from "express-basic-auth";
import type {AddBookReq} from "../../types/addBook.type.js";

/**
 * class provides endpoints for admin panel
 * */
export class AdminRouter {
    /*instance of express-router*/
    private readonly router: Router;

    /*file multer for image upload*/
    private readonly uploadBook;

    /*storage configuration for multer*/
    private storageBook = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/images");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
    // private readonly multer: any;

    /**
     * constructor
     * @authorService - instance of AuthorService
     * @bookService - instance of BookService
     * */
    constructor(private readonly authorService: AuthorService, private readonly bookService: BookService) {
        this.router = express.Router();

        this.router.use(basicAuth({
            users: {
                'librarian': 'lkey',
                'logout': 'working'
            },
            challenge: true

        }))

        // this.multer = multer({dest: 'public/uploads'})

        this.uploadBook = multer({storage: this.storageBook})
        // this.uploadBooks = multer({storage: this.storageBooks})

        this.setupRoutes()
    }

    /**
     * links endpoints with corresponding methods
     * */
    private setupRoutes(): void {
        this.router.get("/", this.getDefault.bind(this))
        this.router.post("/api/v1/book/add-book", this.uploadBook.single('img'), this.addBook.bind(this))
        this.router.delete("/api/v1/book/delete-book", this.deleteBook.bind(this))
        this.router.post("/api/v1/author/add-author", this.addAuthor.bind(this))
        this.router.get("/logout", this.logout.bind(this))
    }

    /**
     * method corresponding to '/' endpoint
     * renders  page of admin panel
     * */
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

    /**
     * method corresponding to '/api/v1/book/add-book'
     * @req - must contain body with Book like object and list of authors
     * @res - status 200 and book id on success or status 500 and error message on failure
     * */
    public async addBook(req: Request, res: Response) {
        const data = req.body

        if (!data.authors) {
            return res.status(400).json({message: "No authors specified"})
        }

        const fileDat = req.file

        if (!fileDat) {
            return res.status(400).json({message: "No file uploaded"})
        }

        const authorIds = Array.isArray(data.authors) ? data.authors : [data.authors];


        const parsedAuthorIds = authorIds.map((id: string) => {
            return parseInt(id)
        })

        const bookDto: BookDto = {
            name: data.name,
            description: data.description,
            image: fileDat.filename,
            // author: data.book.author ? data.book.author : "gugu",
            year: data.year ? data.year : '2000',
        }

        const status = await this.bookService.add(bookDto, parsedAuthorIds)

        if (!status.success) {
            return res.status(500).json({message: status.msg})
        }

        return res.status(200).json({success: true, id: status.id})
    }

    /**
     * method corresponding to '/api/v1/book/add-author'
     * @req - must contain body with author name
     * @res - status 200 and author id on success
     *        or status 500 and error message on failure
     *        or 400 and error message if author name is not specified
     * */
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

    /**
     * method corresponding to '/api/v1/book/delete-book'
     * @req - must contain body with book id
     * @res - status 200 and book id on success
     *        or status 500 and error message on failure
     *        or status 400 and error message if id was not specified
     * */
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


    /**
     * method corresponding to '/logout'
     * @req
     * @res sends response with status 401 and auth header
     * */
    private async logout(req: Request, res: Response) {
        // delete req.headers['authorization']

        res.set('www-authenticate', 'Basic')

        return res.status(401).json({message: "logout successfully"})
    }

    /**
     * returns instance of express-router
     * */
    public getRouter(): Router {
        return this.router;
    }

}
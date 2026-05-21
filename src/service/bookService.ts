import type {BookRepository} from "../repository/bookRepository.js";
import type {JunctionRepository} from "../repository/junctionRepository.js";
import type {BookDto} from "../dto/book.dto.js";
import type {ResultSetHeader} from "mysql2";
import type {BookViewsRepository} from "../repository/bookViewsRepository.js";

export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly junctionRepository: JunctionRepository,
        private readonly bookViewsRepository: BookViewsRepository
    ) {
    }

    public async add(dto: BookDto, authorIds: number[]) {
        try {
            const repRes: ResultSetHeader = await this.bookRepository.add(dto)

            const book_id = repRes.insertId

            if (!book_id) {
                return {success: false, msg: "Failed to add a book"}
            }

            for (const authorId of authorIds) {
                await this.junctionRepository.add(authorId, book_id)
            }


            await this.bookViewsRepository.add(book_id)

            return {success: true, id: book_id}
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async delete(id: number) {
        try {
            const bookRepRes: ResultSetHeader = await this.bookRepository.delete(id)

            if (bookRepRes.affectedRows === 0) {
                return {success: false, msg: "No books with this id found for deletion"}
            }

            // const junctionRepRes: ResultSetHeader = await this.junctionRepository.delete(id)

            return {success: true, id: id};

        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    public async getInRange(offset: number) {
        const booksOnPage: number = 20;

        const books = await this.bookRepository.getInRange(offset, booksOnPage)
        return {success: true, books: books};
    }

    public async getInRangeWithYear(offset: number, year: string) {
        const booksOnPage: number = 20;

        const books = await this.bookRepository.getInRangeWithYear(offset, booksOnPage, year)
        return {success: true, books: books};
    }

    public async searchInRange(offset: number, prompt: string) {
        if (!prompt) {
            return {success: false, msg: "User prompt is required"}
        }

        if (prompt.length === 0) {
            return {success: false, msg: "No books with empty name"}
        }

        const booksOnPage: number = 20;
        const books = await this.bookRepository.searchWithRange(offset, booksOnPage, prompt);
        return {success: true, books: books}
    }

    public async getById(bookId: number) {
        try {
            const result = await this.bookRepository.get(bookId)

            const junctionRes = await this.junctionRepository

            if (!result) {
                return {success: false, msg: "No book with id " + bookId}
            }

            return {success: true, book: result}
        } catch (err) {
            console.log(err)
            return {success: false, msg: "error on repository (get by id)"}
        }
    }

    public async getAll() {
        try {
            const result = await this.bookRepository.getAll();

            if (!result) {
                return {success: false, msg: "No books in the database"}
            }

            return {success: true, books: result}
        } catch (err) {
            console.log(err)
            return {success: false, msg: "error on repository (getAll)"}
        }
    };

    public async searchInRangeWithYear(offset: number, prompt: string, year: string) {
        if (!prompt) {
            return {success: false, msg: "User prompt is required"}
        }

        if (prompt.length === 0) {
            return {success: false, msg: "No books with empty name"}
        }


        const booksOnPage: number = 20;
        const books = await this.bookRepository.searchWithRangeAndYear(offset, booksOnPage, prompt, year);
        return {success: true, books: books}
    }

    public async getViews(bookId: number) {
        const views: number = await this.bookRepository.getBookViews(bookId);

        if (views === undefined || views === null) {
            return {success: false, msg: "No entry with this id found "}
        }

        return {success: true, count: views}
    }

    public async increaseViews(bookId: number) {
        const res: number = await this.bookRepository.increaseViews(bookId);

        if (res === undefined || res === null) {
            return {success: false, msg: "No entry with this id found "}
        }

        return {success: true, count: res}
    }


}
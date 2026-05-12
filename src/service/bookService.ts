import type {BookRepository} from "../repository/bookRepository.js";
import type {JunctionRepository} from "../repository/junctionRepository.js";
import type {BookDto} from "../dto/book.dto.js";
import type {ResultSetHeader} from "mysql2";

export class BookService {
    constructor(readonly bookRepository: BookRepository, readonly junctionRepository: JunctionRepository) {
    }

    public async add(dto: BookDto, authorId: number) {
        try {
            const repRes: ResultSetHeader = await this.bookRepository.add(dto)

            const book_id = repRes.insertId

            if (!book_id) {
                return {success: false, msg: "Failed to add a book"}
            }

            const junction_res = await this.junctionRepository.add(book_id, authorId)

            return {success: true, id: book_id}
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async getInRange(offset: number) {
        const booksOnPage: number = 18;

        const books = await this.bookRepository.getInRange(offset, booksOnPage)
        return {success: true, books: books};
    }

    public async searchInRange(offset: number, prompt: string) {
        if (!prompt) {
            return {success: false, msg: "User prompt is required"}
        }

        if (prompt.length === 0) {
            return {success: false, msg: "No books with empty name"}
        }

        const booksOnPage: number = 18;
        const books = await this.bookRepository.searchWithRange(offset, booksOnPage, prompt);
        return {success: true, books: books}
    }

    public async getById(bookId: number) {
        try {
            const result = await this.bookRepository.get(bookId)

            if (!result) {
                return {success: false, msg: "No book with id " + bookId}
            }

            return {success: true, book: result}
        } catch (err) {
            console.log(err)
            return {success: false, msg: "error on repository (get by id)"}
        }
    }

}
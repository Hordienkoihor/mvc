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
}
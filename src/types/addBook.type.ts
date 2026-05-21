import type {Book} from "./book.type.js";
import type {BookDto} from "../dto/book.dto.js";

export interface AddBookReq {
    book: BookDto,
    authors: number[]
}
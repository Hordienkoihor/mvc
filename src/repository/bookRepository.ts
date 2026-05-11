import type {Pool, RowDataPacket} from "mysql2/promise";
import type {Book} from "../types/book.type.js";
import type {BookDto} from "../dto/book.dto.js";
import type {ResultSetHeader} from "mysql2";

export class BookRepository {
    constructor(readonly pool: Pool) {
        this.pool = pool;
    }

    public async add(book: BookDto) {
        const query = `INSERT INTO books (b_name, b_desc, b_img, b_year)
                       VALUES (?, ?, ?, ?)`

        const values = [
            book.name,
            book.description,
            book.image,
            book.year
        ]

        try {
            const [res, fields] = await this.pool.query<ResultSetHeader>(query, values);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async delete(id: number) {
        const query = `DELETE
                       FROM books
                       WHERE b_id = ?`;

        try {
            const [res] = await this.pool.query(query, [id]);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async get(id: number): Promise<Book> {
        const query = `SELECT *
                       FROM books
                       WHERE b_id = ?`;

        try {
            const [res] = await this.pool.query<RowDataPacket[]>(query, [id]);

            if (res.length === 0) {
                throw new Error(`Book with id ${id} not found`);
            }

            return res[0] as Book;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async update(id: number, book: BookDto) {
        const query = `UPDATE books
                       SET b_name = ?, b_desc = ?, b_img = ?, b_year = ? 
                       WHERE b_id = ?`

        const values = [
            book.name,
            book.description,
            book.image,
            book.year,
            id
        ];

        try {
            const [res] = await this.pool.query(query, values);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    public async getAll(): Promise<Book[]> {
        const query = `SELECT * FROM books`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getInRange(startId: number, endId: number): Promise<Book[]> {
        const query = `SELECT * FROM books LIMIT ? OFFSET ?`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [startId, endId]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}
import type {Pool, RowDataPacket} from "mysql2/promise";
import type {Book} from "../types/book.type.js";
import type {BookDto} from "../dto/book.dto.js";
import type {ResultSetHeader} from "mysql2";
import {debuglog} from "node:util";

export class BookRepository {
    constructor(private readonly pool: Pool) {
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
            const [res] = await this.pool.query<ResultSetHeader>(query, [id]);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async get(id: number): Promise<Book> {
        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       WHERE b.b_id = ?`;

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
                       SET b_name = ?,
                           b_desc = ?,
                           b_img  = ?,
                           b_year = ?
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
        const query = `SELECT *
                       FROM books`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getInRange(startId: number, endId: number): Promise<Book[]> {
        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       GROUP BY b.b_id LIMIT ?
                       OFFSET ?;`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [endId, startId]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async getInRangeWithYear(startId: number, endId: number, year: string): Promise<Book[]> {
        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       WHERE b.b_year = ?
                       GROUP BY b.b_id LIMIT ?
                       OFFSET ?;`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [year, endId, startId]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async searchWithRange(startId: number, endId: number, prompt: string): Promise<Book[]> {
        const searchPattern = `%${prompt}%`;

        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       WHERE B.b_name LIKE ?
                       GROUP BY b.b_id LIMIT ?
                       OFFSET ?;`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [searchPattern, endId, startId]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async searchWithRangeAndYear(startId: number, endId: number, prompt: string, year: string): Promise<Book[]> {
        const searchPattern = `%${prompt}%`;

        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       WHERE B.b_name LIKE ?
                         AND B.b_year = ?
                       GROUP BY b.b_id LIMIT ?
                       OFFSET ?;`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [searchPattern, year, endId, startId]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    public async search(prompt: string): Promise<Book[]> {
        const searchPattern = `%${prompt}%`;

        const query = `SELECT b.b_id   as id,
                              b.b_name as name,
                              b.b_desc as description,
                              b.b_img  as img,
                              b.b_year as year,
                              GROUP_CONCAT(a.a_name SEPARATOR ', ') AS author
                       FROM books b
                           LEFT JOIN authorBook ab
                       ON b.b_id = ab.b_id
                           LEFT JOIN authors a ON ab.a_id = a.a_id
                       WHERE B.b_name LIKE ?
                       GROUP BY b.b_id;`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Book[]>(query, [searchPattern]);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async increaseViews(id: number) {
        const query = `UPDATE bookViews
                       SET b_count = b_count + 1
                       WHERE b_id = ?
        `

        try {
            const [data] = await this.pool.query<ResultSetHeader>(query, [id]);
            return this.getBookViews(id)
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async getBookViews(id: number) {
        const query = `SELECT b_count
                       FROM bookViews
                       WHERE b_id = ?`;

        try {
            const [data] = await this.pool.query<RowDataPacket[]>(query, [id]);

            if (data.length === 0) {
                return null;
            }

            return (data[0] as RowDataPacket).b_count;
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

}
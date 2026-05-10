import type {Pool, RowDataPacket} from "mysql2/promise";
import type {AuthorDto} from "../dto/author.dto.js";
import type {Author} from "../types/author.type.js";
import type {Book} from "../types/book.type.js";
import type {ResultSetHeader} from "mysql2";

export class AuthorRepository {
    constructor(readonly pool: Pool) {
        this.pool = pool;
    }

    public async add(author: AuthorDto) {
        const query = `INSERT INTO authors (a_name)
                       VALUES (?)`

        try {
            const [res] = await this.pool.query<ResultSetHeader>(query, [author.name]);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async delete(id: number) {
        const query = `DELETE FROM authors WHERE a_id = ?`;

        try {
            const [res] = await this.pool.query(query, [id]);
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async get(id: number): Promise<Author> {
        const query = `SELECT *
                       FROM authors
                       WHERE a_id = ?`;

        try {
            const [res] = await this.pool.query<RowDataPacket[]>(query, [id]);

            if (res.length === 0) {
                throw new Error(`Author with id ${id} not found`);
            }

            return res[0] as Author;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getAll(): Promise<Author[]> {
        const query = `SELECT * FROM authors`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & Author[]>(query);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
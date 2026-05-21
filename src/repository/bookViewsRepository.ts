import type {Pool} from "mysql2/promise";

export class BookViewsRepository {
    constructor(private pool: Pool ) {}

    public async add(bookId: number) {
        const query =  `INSERT INTO bookViews (b_id) VALUES (?);`;

        await this.pool.query(query, [bookId]);
    }
}
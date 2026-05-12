import type {Pool, RowDataPacket} from "mysql2/promise";
import type {JunctionLinkType} from "../types/junctionLink.type.js";

export class JunctionRepository {
    constructor(private readonly pool: Pool) {
        this.pool = pool;
    }

    public async add(a_id: number, b_id: number) {
        const query = `INSERT INTO authorBook (a_id, b_id)
                       VALUES (?, ?)`

        try {
            const [res] = await this.pool.query(query, [a_id, b_id]);
            return res;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async delete(a_id: number, b_id: number) {
        const query = `DELETE FROM authorBook WHERE a_id = ? AND b_id = ?`;

        try {
            const [res] = await this.pool.query(query, [a_id, b_id]);
            return res;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async getLinkByBook(b_id: number) {
        const query = `SELECT TOP 1 * FROM authorBook WHERE b_id = ?`;

        try {
            const [data, meta] = await this.pool.query<RowDataPacket[] & JunctionLinkType>(query, [b_id]);
            return data;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
}
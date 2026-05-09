import type {Pool} from "mysql2/promise";

export class JunctionRepository {
    constructor(readonly pool: Pool) {
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
}
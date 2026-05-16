import type {AuthorRepository} from "../repository/authorRepository.js";
import type {AuthorDto} from "../dto/author.dto.js";
import type {ResultSetHeader} from "mysql2";
import type {Author} from "../types/author.type.js";

export class AuthorService {
    constructor(private readonly authorRepository: AuthorRepository) {
    }


    public async add(authorDto: AuthorDto) {
        try {
            const rep_res: ResultSetHeader = await this.authorRepository.add(authorDto);

            if (! rep_res.insertId) {
                return {success: false, msg: "Failed to add a author"}
            }

            return {success: true, id: rep_res.insertId};
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async delete(id: number) {
        try {
            const rep_res = await this.authorRepository.delete(id);

            if (!rep_res) {
                return {success: false, msg: "Failed to delete author"}
            }

            return {success: true, id: id};
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public async getAll() {
        try {
            const rep_res = await this.authorRepository.getAll();

            if (!rep_res) {
                return {success: false, msg: "Failed to retrieve authors"}
            }

            return {success: true, authors: rep_res};
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
}
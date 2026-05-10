import type {AuthorRepository} from "../repository/authorRepository.js";
import type {AuthorDto} from "../dto/author.dto.js";
import type {ResultSetHeader} from "mysql2";

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
}
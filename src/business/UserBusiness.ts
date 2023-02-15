import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager
    ){}
    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> => {
        const { q } = input

        if(typeof q !== "string" && q !== undefined){
            throw new BadRequestError("'q' deve ser string ou undefined")
        }
        
        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.password,
                userDB.email,
                userDB.role,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutput = users

        return output
    }

    public login = async (input: LoginInput): Promise<LoginOutput> => {
        const { email, password } = input

        if(typeof password !== "string"){
            throw new Error("'password' deve ser string")
        }

        if(typeof email !== "string"){
            throw new Error("'email' deve ser string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if(!userDB){
            throw new NotFoundError("'email' não encontrado")
        }

        if(password !== userDB.password){
            throw new BadRequestError("'email' ou 'password' incorretos")
        }

        const tokenPayload: TokenPayload = {
            id: userDB.id,
            name: userDB.name,
            role: userDB.role
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: LoginOutput = {
            message: "Login realizado com sucesso",
            token
        }

        return output
    }
}
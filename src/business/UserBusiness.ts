import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput, SingnupInput, SingnupOutput } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
        private hashManager: HashManager
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

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.password,
            userDB.email,
            userDB.role,
            userDB.created_at
        )

        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword())

        if(!isPasswordCorrect){
            throw new BadRequestError("'email' ou 'password' incorreto")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutput = {
            message: "Login realizado com sucesso",
            token
        }
        
        return output
    }

    public signup = async (input: SingnupInput): Promise<SingnupOutput> => {
        const { name, email, password } = input

        if(typeof name !== "string"){
            throw new Error("'password' deve ser string")
        }

        if(typeof email !== "string"){
            throw new Error("'email' deve ser string")
        }

        if(typeof password !== "string"){
            throw new Error("'email' deve ser string")
        }

        const id = this.idGenerator.generate()

        const passwordHash = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            passwordHash,
            email,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SingnupOutput = {
            message: "Cadastro realizado com sucesso",
            token
        }

        return output
    }
}
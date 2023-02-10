import { UserDatabase } from "../database/UserDatabase";
import { User } from "../models/User";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase
    ){}
    public getUsers = async (input: any) => {
        const { q } = input

        
        const usersDB = await this.userDatabase.findUsers(q)

        const users: User[] = usersDB.map((userDB) => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.created_at
        ))

        return users
    }
}
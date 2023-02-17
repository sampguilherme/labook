
import { PostDatabase } from "../database/PostDatabase";
import { GetPostsInput, GetPostsOutput } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostWithCreatorDB } from "../types";


export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    public getPosts = async (input: GetPostsInput): Promise<GetPostsOutput> => {
        const {token} = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inváido")
        }

        const postsWithCreatorsDB: PostWithCreatorDB[] = await this.postDatabase.findPosts()

        const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )
            return post.toBusinessModel()
        })

        const output: GetPostsOutput = posts

        return output
    }
}
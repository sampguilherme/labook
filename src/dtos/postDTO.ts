import { PostModel } from "../types"


export interface GetPostsInput{
    token: string | undefined
}

export type GetPostsOutput = PostModel[]

export interface CreatPostInput {
    token: string | undefined
}

export interface EditPostInput {
    idToEdit: string,
    token: string | undefined,
    name: unknown
}

export interface DeletePostInput {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikePostInput {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}
import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostInput, GetPostsInput } from "../dtos/postDTO";
import { BaseError } from "../errors/BaseError";


export class PostController {
    constructor (
        private postBusiness: PostBusiness,
    ){}
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInput = {
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInput = {
                token: req.headers.authorization,
                content: req.body.content
            }

            await this.postBusiness.createPost(input)

            res.status(201).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}
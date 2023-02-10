import express, { Request, Response } from 'express'
import cors from 'cors'
import { UserController } from './controller/UserController'
import { UserBusiness } from './business/UserBusiness'
import { UserDatabase } from './database/UserDatabase'
import { userRouter } from './router/userRouter'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})



app.use('/users', userRouter)

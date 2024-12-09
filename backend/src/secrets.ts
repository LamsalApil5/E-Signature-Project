import dotenv from 'dotenv'

dotenv.config({path:'.env'})

export const PORT = process.env.PORT

export const JWT_SECRET = process.env.JWT_SECRET!

export const CHATGPT_KEY = process.env.OPENAI_API_KEY
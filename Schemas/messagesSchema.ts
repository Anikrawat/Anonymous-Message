import {z} from 'zod'

const contentValidation = z
    .string()
    .min(10,{message:"Content must be atleast of 10 characters"})
    .max(300,{message:"content must be no longer than 300 characters"})

const messagesSchema = z.object({
    content:contentValidation
})

export default messagesSchema
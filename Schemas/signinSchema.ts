import {z} from 'zod'

const identifierValidation = z
    .string()

const passwordValidation = z
    .string()
    .min(6,{message: 'Password must be more than 6 characters'})

const signInSchema = z.object({
    identifier:identifierValidation,
    password:passwordValidation
})

export default signInSchema
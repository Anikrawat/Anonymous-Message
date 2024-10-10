import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3,{message:'Username must be 3 characters long'})
    .max(20,{message:'Username must be no more than 20 characters long'})
    .regex(/^[a-zA-Z0-9\.\_]+$/,{message:'Username must not contain any special characters except "_"'})

const emailValidation = z
    .string()
    .email({message:'Invalid Email Address.'})

const passwordValidation = z
    .string()
    .min(6,{message:"Password must be 6 characters long"})

const signUpSchema = z.object({
    username:usernameValidation,
    email:emailValidation,
    password:passwordValidation
})

export default signUpSchema
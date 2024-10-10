import {z} from 'zod'

const verificationCodeValidation = z
    .string()
    .length(6,{message:'Code should be 6 digits long'})

const verificationCodeSchema = z.object({
    verifyCode:verificationCodeValidation
})

export default verificationCodeSchema
import userModel from "@/app/Models/user";
import dbConnect from "@/lib/dbConnect";
import response from "@/../types/response";
import bcrypt from 'bcryptjs'
import sendVerificationEmail, { apiResponse } from "../../../../Helpers/sendVerificationEmail";

export async function POST(request:Request):Promise<Response>{
    dbConnect()

    try {
        const {username,email,password} = await request.json()

        const existingUserVerifiedByUsername = await userModel.findOne({username,isVerified:true})

        if (existingUserVerifiedByUsername) {
            return response(false,'Username Already Exists',400)
        }

        const existingUserVerifiedByEmail = await userModel.findOne({email})

        const verifyCode:string = Math.floor(100000 + Math.random() * 900000).toString()
        

        if (existingUserVerifiedByEmail ) {
            if(existingUserVerifiedByEmail.isVerified){
                return response(false,'Email already exists',400)
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password,salt)
                existingUserVerifiedByEmail.password = hashedPassword
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save()
            }
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]
            })

            const response = await newUser.save()
            console.log(response)
        }


        const emailResponse:apiResponse = await sendVerificationEmail(email,username,verifyCode)

        console.log(emailResponse) //TODO: Remove this

        if(!emailResponse.success){
            return response(false,emailResponse.message,400)
        }


        return response(true,emailResponse.message,200)


    } catch (error) {
        console.log('Error registering User')
        return response(false,'Internal Server Error',500)
    }
}

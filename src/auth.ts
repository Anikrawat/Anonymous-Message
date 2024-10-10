import NextAuth, { CredentialsSignin } from "next-auth"
import credentials from "next-auth/providers/credentials"
import userModel from "@/../Models/user"
import dbConnect from "./lib/dbConnect"
import bcrypt from 'bcryptjs'
 
export const {handlers,auth} = NextAuth({
  providers: [
    credentials({
        credentials:{
            email:{label:"email",type:'email'},
            password:{label:'password',type:'password'}
        },
        authorize:async (credentials) => {
            const email = credentials.email as string | undefined
            const password = credentials.password as string | undefined

            if (!email || !password) {
                throw new CredentialsSignin("Please provide email and password here")
            }

            try {
                await dbConnect()

                const existingUser = await userModel.findOne({email})

                if (!existingUser) {
                    throw new Error('User does not exist. Please Sign up First')
                }

                if (existingUser && !existingUser.isVerified) {
                    throw new Error('You are not verified please sign up again.')
                }

                const isMatched = await bcrypt.compare(password,existingUser.password)  

                if (!isMatched) {
                    throw new Error("Please enter correct password")
                }

                const user = {
                    _id: existingUser._id?.toString(),
                    isVerified: existingUser.isVerified,
                    email: existingUser.email,
                    username: existingUser.username,
                    isAcceptingMessages: existingUser.isAcceptingMessages
                  }
        
                  return user;
            } catch (error) {
                console.error("Error Signing In: ",error)
                return null
            }
        },
        
    })
  ],
  secret:process.env.AUTH_SECRET,
  pages:{
    signIn:'/signin'
  },
  session:{
    strategy:'jwt'
  },
  callbacks:{
    async jwt({token,user}){
        if(user){
            token._id = user._id?.toString()
            token.username = user.username
            token.email = user.email
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
        }
        return token
    },
    async session({session,token}){
        if(token){
            session.user._id = token._id?.toString()
            session.user.username = token.username as string
            session.user.email = token.email as string
            session.user.isVerified = token.isVerified as boolean
            session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
        }
        return session
    }
  }
})
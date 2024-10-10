import { auth } from "@/auth";
import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/Models/user";
import { User } from "next-auth";
import response from "@/../types/response";
import mongoose from "mongoose";


export async function GET(){
    await dbConnect()

    const session = await auth()
    const user:User = session?.user as User;
    // console.log(user)
    if (!session || !session.user) {
        return response(false,'Not Authenticated',401)
    }

    
    try {
    const userId = new mongoose.Types.ObjectId(user._id)
    // console.log(userId)
    const userDocument = await userModel.findById(userId).exec();
    
    if (userDocument?.messages.length === 0) {
        console.log('No messages found for user');
        return response(true, 'No messages found', 200);
    }

        const userMessage = await userModel.aggregate([
            {$match:{_id:userId}},
            {$unwind: '$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ]).exec()

        // console.log(userMessage)

        if (!userMessage || userMessage.length === 0) {
            // console.log('user not found')
            return response(false,'User not found',400)
        }

        return Response.json({
            success:true,
            Messages:userMessage[0].messages
        },{status:200})

    } catch (error) {
        console.log("Error getting messages")
        return response(false,"Internal Server Error",500)
    }


}
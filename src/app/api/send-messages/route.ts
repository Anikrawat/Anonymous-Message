import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/Models/user";
import { Message } from "@/app/Models/message";
import response from "@/../types/response";

export async function POST(request:Request){
    await dbConnect()

    const {username,content} = await request.json()

    try {
        const user = await userModel.findOne({username})
        if (!user) {
            return response(false,'User not found',404)
        }

        if (!user.isAcceptingMessages) {
            return response(false,'User is not accepting messages',403)
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return response(true,"Message sent successfully",200)
    } catch (error) {
        console.log("Error sending messages ", error);
        
        return response(false,"Internal Server Error",500)
    }

}
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/../Models/user";
import { User } from "next-auth";
import response  from "../../../../types/response";

export async function POST(request:Request){
    await dbConnect()

    const session = await auth()
    const user:User = session?.user as User;

    if (!session || !session.user) {
        return response(false,'Not Authenticated',401)
    }

    const userId:string = user._id || ""
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new:true}
        )

        console.log(updatedUser?.isAcceptingMessages)

        if (!updatedUser) {
            return response(false,"Failed to update user status to accept messages",401)
        }

        return response(true,'Message acceptance status updated successfully',200,updatedUser as User)

    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return response(false,"Failed to update user status to accept messages",500)
    }

}

export async function GET(){
    await dbConnect()

    const session = await auth()
    const user:User = session?.user as User;

    if (!session || !session.user) {
        return response(false,'Not Authenticated',401)
    }

    const userId = user._id;

    try {
        const foundUser = await userModel.findById(userId)
    
        if (!foundUser) {
            return response(false,"Failed to update user status to accept messages",401)
        }

        return response(true,"Found the User",200,{isAcceptingMessages:foundUser.isAcceptingMessages})

    } catch (error) {
        console.log("Error getting accept message status")
        return response(false,"Error getting accept message status",500)
    }

}
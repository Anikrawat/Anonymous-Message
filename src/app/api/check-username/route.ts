import dbConnect from "@/lib/dbConnect";
import userModel from "@/../Models/user";
import { z } from "zod";
import { usernameValidation } from "@/../Schemas/signupSchema";


const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request: Request){

    await dbConnect();

    try {

        const {searchParams} = new URL(request.url);
        const queryParam = {
            username:searchParams.get('username')
        }
        
        const result = usernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:`${
                    usernameError?.length > 0 ? usernameError.join(', ') : "Invalid Query Parameters"
                }`
            },{status:400})
        }

        const {username} = result.data;

        const existingVerifiedUser = await userModel.findOne({username,isVerified:true})

        if (existingVerifiedUser) {
            return Response.json({
                success:false,
                message:'Username is already Taken'
            },{status:400})
        }

        return Response.json({
            success:true,
            message:'Username is Available'
        },{status:200})

    } catch (error) {
        console.error("Error checking Username: ",error);
        return Response.json({
            message:"Error checking Username",
            success:false
        },
        {status:500});
    }
}
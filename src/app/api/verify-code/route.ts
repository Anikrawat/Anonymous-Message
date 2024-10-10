import dbConnect from "@/app/lib/dbConnect";
import userModel from "../../Models/user";
import response from "../../../../types/response";


export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,verifyCode} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await userModel.findOne({username:decodedUsername});

        if (!user) {
            return response(false,"User Does not exists. Please Register yourself",400)
        }

        if (user.verifyCode === verifyCode && new Date(user.verifyCodeExpiry) > new Date()) {
            user.isVerified = true;
            await user.save()
            return response(true,"User Verified Successfully",200);
        }

        if (user.verifyCode !== verifyCode) {
            return response(false,"The code you entered is not correct",400)
        }

        if (!(new Date(user.verifyCodeExpiry) > new Date())) {
            return response(false,"Your verification code is expired. Please Register again",400)
        }

    } catch (error) {
        console.log("Error while verifying: ", error)
        return response(false,"Error while verifying",500)
    }
}
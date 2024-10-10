import { User } from "next-auth"


const response = async (success:boolean,message:string,status:number,...other:Array<User>) => {
    return Response.json({
        success,
        message,
        other:other
    },{status})
}

export default response;
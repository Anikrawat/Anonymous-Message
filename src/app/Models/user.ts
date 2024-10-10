import { Message,messageSchema } from "./message";
import {models,model,Model,Schema,Document} from "mongoose";


export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages:Message[];
}


const userSchema:Schema<User> = new Schema({
    username: {
        type:String,
        required:[true,'Username is required'],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter valid email address"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        required:true,
        default:true
    },
    messages:[messageSchema]

})


const userModel = models?.User as Model<User> || model<User>('User',userSchema)

export default userModel;
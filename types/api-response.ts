import { Message } from "@/app/Models/message";

export interface apiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean;
    messages?:Array<Message>
}
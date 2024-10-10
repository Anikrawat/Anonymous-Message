import { Message } from "@/../Models/message";

export interface apiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean;
    messages?:Array<Message>
}
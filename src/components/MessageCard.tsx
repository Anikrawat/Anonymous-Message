"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "../app/Models/message";
import { useToast } from "./hooks/use-toast";
import axios from "axios";
import { apiResponse } from "../../Helpers/sendVerificationEmail";

type messageCardProp = {
    message: Message;
    onMessageDelete: (messageId:string) => void
}

const MessageCard = ({message,onMessageDelete}:messageCardProp) => {

    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<apiResponse>(`api/delete-messages/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id as string)
    }

  return (
    <Card className="flex flex-col justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
          <div className="w-14 self-end">
            <Button className="bg-white hover:bg-white"><X className="text-black"/></Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>{`Received at: ${message.createdAt}`}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCard;

'use client'

import { useCallback, useEffect, useState } from "react"
import { Message } from "../../../Models/message"
import { useToast } from "@/components/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import acceptingMessagesSchema from "../../../Schemas/acceptingMessagesSchema"
import axios, { AxiosError } from "axios"
import { apiResponse } from "../../../types/api-response"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import { User } from "next-auth"

const Dashboard = () => {

  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  const [isAcceptMessagesLoaded, setIsAcceptMessagesLoaded] = useState(false);


  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) => {
    setMessages(messages.filter((message)=>message._id !== messageId))
  }

  const {data:session,status} = useSession()

  const form = useForm({
    resolver:zodResolver(acceptingMessagesSchema)
  })

  const {register,watch,setValue} = form

  

  const acceptMessage = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true)
    try {

      const response = await axios.get('/api/accept-messages')
      setValue('acceptMessages',response.data.isAcceptingMessages)
      setIsAcceptMessagesLoaded(true);

    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch Message Setting",
        variant:'destructive'
      })
    } finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])


  const fetchMessages = useCallback(async (refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(true)

    try {
      const response = await axios.get('api/get-messages')
      setMessages(response.data.Messages || [])
      if(refresh){
        toast({
          title:"Refreshed Messages",
          description:"Showing Latest Messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch Message Setting",
        variant:'destructive'
      })
    }finally{
      setIsSwitchLoading(false)
      setIsLoading(false)
    }

  },[setIsLoading,setMessages,toast])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  },[session])

  const handleSwitchChange = async () => {
    try {
      console.log(acceptMessage)
      const response = await axios.post('api/accept-messages',{acceptMessages: !acceptMessage})
      setValue("acceptMessages",!acceptMessage)
      console.log(response.data.message)
      toast({
        title:response.data.message,
        variant:'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch Message Setting",
        variant:'destructive'
      })
    }
  }
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  const user = session?.user as User
  let baseURL = '';
  let profileURL = '';

  if (typeof window !== 'undefined') {
    baseURL = `${window.location.protocol}//${window.location.host}`;
    profileURL = `${baseURL}/u/${user.username}`;
  }

  // console.log(session?.user)


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    toast({
      title:'URL Copied',
      description:'Profile URL has been copied to clipboard'
    })
  }

  

  if (!session || !session.user) {
    return <div> Please Login </div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading|| !isAcceptMessagesLoaded}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
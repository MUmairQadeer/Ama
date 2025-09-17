'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/model/User';
import { acceptMesssageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm ,} from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const [messages ,setMessages] =useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);


  const handleDeleteMessage = async (messageId: string) => { 
    
    await axios.delete<ApiResponse>(`/api/delete-message?messageid=${messageId}`)
    setMessages(messages.filter((message) => message._id !== messageId));
}
    const {data :session} =useSession()

    const form =useForm({
      resolver: zodResolver(acceptMesssageSchema),
    })

    const {register ,watch ,setValue} =form;
    const acceptMessages = watch('acceptMessages');
  
    const fetchAcceptMessage =useCallback(async () => {
      setIsSwitchLoading(true);
      try {
        const response =await axios.get<ApiResponse>('/api/accept-message');
        setValue('acceptMessages', response.data.isAcceptingMessage ?? false);
        // console.log(response,"response1");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
 
         toast("Error", {
                    description: axiosError.response?.data.message ||"Failed to fetch message setting",
                    action: {
                      label: "ok",
                      onClick: () => console.log("Undo",),
                    },
                  })
      } finally{
        setIsSwitchLoading(false)
      }

    },[setValue]);
  

    const fetchMessages =useCallback(async(refresh: boolean =false)=>{
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const response =await axios.post<ApiResponse>('/api/get-messages')
        console.log(response.data.messages,"response2");
        setMessages(response.data.messages || [])
        if(refresh){
           toast("Refreshed Messages", {
                      description: "Showing latest messages",
                      action: {
                        label: "ok",
                        onClick: () => console.log("ok",),
                      },
                    })
        }
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast("Error", {
                    description: axiosError.response?.data.message ||"Failed to fetch message setting",
                    action: {
                      label: "ok",
                      onClick: () => console.log("ok",),
                    },
                  })
        
      }
      finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
    },[setIsLoading,setMessages]);
  

  useEffect(()=>{
     if(!session || !session.user) return;
     fetchMessages(); 
     fetchAcceptMessage();
  },[session ,setValue ,fetchAcceptMessage ,fetchMessages]);

  //handle switch change 
  const handleSwitchChange =async (acceptMessages: boolean) => {
   try {
    const response = await axios.post<ApiResponse>('/api/accept-message', { 
       acceptMessages: !acceptMessages });
       setValue('acceptMessages', !acceptMessages);
       toast(response.data.message, {
                  description: response.data.message,
                 
                })
   } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
           toast("Error", {
                  description: axiosError.response?.data.message ||"Failed to fetch message setting",
                 
                })
   }
  }

  const {username} =session?.user as User ?? {};


  // //todo more research

  // const basUrl =`${window.location.protocol}//${window.location.host}`
  // const profileUrl =`${basUrl}/u/${username}`

  const [profileUrl, setProfileUrl] = useState("");

useEffect(() => {
  if (typeof window !== "undefined" && username) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${baseUrl}/u/${username}`);
  }
}, [username]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast( "URl Copied",{
      description: "Profile URL copied to clipboard",
    })
     
  }

  if(!session || !session.user) {
    <div>Please Login</div>
  }

  return (
    
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 ">User Dashboard</h1>

       <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        
        <Switch
          {...register('acceptMessages')}
          // checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        /> 
         <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }
      }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              // key={message._id}
              key={index}
              
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
              
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div> 
    </div>
  );
}
  // }

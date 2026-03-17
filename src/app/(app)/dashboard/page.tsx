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
import { useForm, } from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);


  const handleDeleteMessage = async (messageId: string) => {

    await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
    setMessages(messages.filter((message) => message._id !== messageId));
  }
  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMesssageSchema),

  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message setting",
      })
    } finally {
      setIsSwitchLoading(false)
    }

  }, [setValue]);


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.post<ApiResponse>('/api/get-messages')
      // console.log(response.data.messages,"response2");
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success(response.data.message || "Messages refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message setting",
      })

    }
    finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages]);


  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //handle switch change 
  const handleSwitchChange = async (checked: boolean) => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: checked,
      });
      setValue("acceptMessages", checked);
      toast.success(response.data.message || "Settings updated");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to update message setting",
      });
    }
  };


  const { username } = session?.user as User ?? {};


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
    toast.success("URL Copied", {
      description: "Profile URL copied to clipboard",
    })

  }

  if (!session || !session.user) {
    <div>Please Login</div>
  }

  return (

    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 md:p-10 bg-card border border-border/40 shadow-xl rounded-2xl w-full max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border/40 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          User Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col p-5 bg-muted/30 rounded-xl border border-border/30">
          <h2 className="text-lg font-semibold mb-3 text-foreground">Copy Your Unique Link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2.5 rounded-lg bg-background text-muted-foreground border border-border/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
            />
            <Button onClick={copyToClipboard} className="px-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Copy
            </Button>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-muted/30 rounded-xl border border-border/30 justify-center">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">Accept Messages</h2>
              <p className="text-sm text-muted-foreground">Toggle whether you're open to receiving feedback.</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-sm font-semibold w-8 text-right">
                {acceptMessages ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-sm hover:shadow-md transition-all border-border/50 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <span className="ml-3 text-sm text-muted-foreground font-medium">Refresh messages</span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full py-12 px-4 flex flex-col items-center justify-center text-center bg-muted/20 border border-dashed border-border/50 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">No messages yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">When someone sends you a mysterious message, it will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// }

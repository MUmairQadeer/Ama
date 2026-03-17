'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import * as z from 'zod'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Chat from "../../../components/Chat"
import { toast } from 'sonner'
export default function Page() {


  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      Content: '',
    },
  })

  // 🔥 New function: handle question selection from Chat
  const handleSelectMessage = (msg: string) => {
    form.setValue("Content", msg)  // updates react-hook-form
  }
  const params = useParams<{ username: string }>();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.Content
      })

      if (response?.data?.success) {
        form.reset()
        toast.success("Message Sent", {
          description: "Your anonymous message has been delivered securely.",
        })
      }
      else {
        toast.error("Delivery Failed", {
          description: response.data.message || "Something went wrong.",
        })
        form.reset()
      }

      setIsSubmitting(false)
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred while sending your message. Please try again.",
      })
      console.log(error)
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4'>
      <div className='w-full max-w-xl p-8 md:p-10 space-y-8 bg-card border border-border/40 shadow-2xl rounded-2xl relative overflow-hidden'>

        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center relative z-10 space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-1">
            Public Profile Link
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium">
            Send an anonymous message to <span className="text-foreground font-bold">@{params.username}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 relative z-10'>
            <FormField
              control={form.control}
              name="Content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      placeholder="Write your anonymous message here..."
                      className="w-full min-h-[120px] p-4 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              className="w-full py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              type="submit"
              disabled={isSubmitting || !form.watch('Content')}
            >
              {
                isSubmitting ? (
                  <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending... </>
                ) : (
                  "Send Message"
                )
              }
            </Button>
          </form>
        </Form>

        <div className="relative z-10 pt-6 border-t border-border/40">
          <Chat setMessage={handleSelectMessage} />
        </div>

      </div>
    </div>
  )

}

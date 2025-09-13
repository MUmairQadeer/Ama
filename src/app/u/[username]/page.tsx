'use client'
import React, {  useState } from 'react'
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
     const response
       = await axios.post('/api/send-message', {
         username: params.username,
         content: data.Content
       })
       console.log(response)
     if(response?.data?.success){
       form.reset()
       alert("Message sent")
     }
     setIsSubmitting(false)
   } catch (error) {
    alert("Error while send message" ,)
    console.log(error)
   }



  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <Chat 
          setMessage={handleSelectMessage}
          />
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
              control={form.control}
              name="Content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Message" {...field} 
                    
                    />
                  </FormControl>

                  <FormDescription>This is your Message.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit"  disabled={isSubmitting}>
              {
                isSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait </>) : ("Send Message")
              }
            </Button>

          </form>
        </Form>



      </div>
    </div>
  )

}

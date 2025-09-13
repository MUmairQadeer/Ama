'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import { Link } from '@react-email/components'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage  } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


export default function Page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',

    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username.length >3) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response
            = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
          setIsCheckingUsername(false)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Something went wrong while checking username')

        } finally {
          setIsCheckingUsername(false)
        }
      }
      else if(username.length >=1){
        setUsernameMessage('Username must be more than 3 characters')
      }
      else{
        setUsernameMessage('')
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
     
       toast("Sign up Success", {
          description: response.data.message,
         
        })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error signing up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
    
       toast("Sign up Failed", {
          description: errorMessage,
         
        })
      setIsSubmitting(false)


    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
       
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="This is your public display name." {...field}
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}  />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <FormDescription>{usernameMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}
                     />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Password" {...field}
                     />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait </>): ("Sign up")
              }
            </Button>

          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member ?{' '}
            <Link href='/sign-in ' className='text-blue-600 hover:text-blue-800'>
            Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

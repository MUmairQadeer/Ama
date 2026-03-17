'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
    // console.log("username",username )
    const checkUsernameUnique = async () => {
      if (username.length > 3) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response
            = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
          // console.log(response.data.message,"gdgb rth  tynbt y")
          setIsCheckingUsername(false)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Something went wrong while checking username')

        } finally {
          setIsCheckingUsername(false)
        }
      }
      else if (username.length >= 1) {
        setUsernameMessage('Username must be more than 3 characters')
      }
      else {
        setUsernameMessage('')
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      toast.success("Sign up Success", {
        description: response.data.message,
      })

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error signing up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message

      toast.error("Sign up Failed", {
        description: errorMessage || "There was a problem signing up. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4'>
      <div className='w-full max-w-md p-8 space-y-8 bg-card border border-border/40 shadow-2xl rounded-2xl relative overflow-hidden'>
        {/* Subtle decorative gradient blob */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Join Mystery Message
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 relative z-10'>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Choose a unique username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  <div className="min-h-[20px] pt-1">
                    {isCheckingUsername ? (
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Loader2 className="animate-spin h-3 w-3 mr-1" /> Checking up...
                      </span>
                    ) : (
                      <FormDescription className={`text-xs ${usernameMessage === 'Username is unique' ? 'text-green-500' : usernameMessage ? 'text-destructive' : ''}`}>
                        {usernameMessage}
                      </FormDescription>
                    )}
                  </div>
                  <FormMessage className="text-xs mt-0" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      type='password'
                      placeholder="Create a strong password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-6 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              type="submit"
              disabled={isSubmitting}
            >
              {
                isSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait </>) : ("Sign up")
              }
            </Button>

          </form>
        </Form>

        <div className="text-center mt-6 relative z-10">
          <p className="text-sm text-muted-foreground">
            Already a member?{' '}
            <Link href='/sign-in' className='text-primary font-medium hover:text-primary/80 transition-colors hover:underline underline-offset-4'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

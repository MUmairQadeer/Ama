'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import { Link } from '@react-email/components'
import {useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'


export default function Page() {

 const [isSubmitting ,setIsSubmitting] =useState(false)


  const router = useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {

      identifier: '',
      password: '',

    },
  })



  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      toast("Login Failed", {
          description: "Incorrect username or password",
          action: {
            label: "ok",
            onClick: () => console.log("",result?.error),
          },

        })
      setIsSubmitting(false)
    }
    if (result?.url) {
      router.replace('/dashboard')
    }

  }


return (
  <div className='flex justify-center items-center min-h-screen bg-gray-100'>
    <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
      <div className="text-center"> 
       
        <h1 className="text-3xl font-bold tracking-tight lg:text-5xl mb-4">
          Start Your Mystery Message
        </h1>
        <p className="mb-4">
          Sign in to start your anonymous adventure
        </p>
      </div>
     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" {...field}
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
          <Button type="submit" >
            Sign in
          </Button>

        </form>
      </Form>

      <div className="text-center mt-4">
        <p>
          Create an account ?{' '}
          <Link href='/sign-up ' className='text-blue-600 hover:text-blue-800 cursor-pointer'>
           { isSubmitting ?? <Loader2 className='animate-spin'/> } Sign up
          </Link>
        </p>
      </div>
    </div>
    
  </div>
)

}

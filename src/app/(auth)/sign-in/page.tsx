'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'


export default function Page() {

  const [isSubmitting, setIsSubmitting] = useState(false)


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
      toast.error("Login Failed", {
        description: "Incorrect username or password",
      })
      setIsSubmitting(false)
    } else if (result?.url) {
      toast.success("Login Successful", {
        description: "Welcome back to your dashboard",
      })
      router.replace('/dashboard')
    }
  }


  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4'>
      <div className='w-full max-w-md p-8 space-y-8 bg-card border border-border/40 shadow-2xl rounded-2xl relative overflow-hidden'>
        {/* Subtle decorative gradient blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">

          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to continue your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 relative z-10'>

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      placeholder="Enter your email or username"
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
                      placeholder="Enter your password"
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
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign in"
              )}
            </Button>

          </form>
        </Form>

        <div className="text-center mt-6 flex justify-center flex-row w-full relative z-10">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href='/sign-up' className='text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:underline underline-offset-4'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )

}

'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import React from 'react'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'>
            <div className='container mx-auto px-4 md:px-6 h-16 flex items-center justify-between'>
                <a className='text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
                    href="">Mystery Message</a>
                <div className='flex items-center space-x-4'>
                    {session ? (
                        <>
                            <span className='hidden md:inline-block text-sm font-medium text-muted-foreground'>
                                Welcome, <span className='text-foreground'>{user?.username || user?.email}</span>
                            </span>
                            <Button
                                className='rounded-full px-6 shadow-sm hover:shadow-md transition-shadow'
                                onClick={() => signOut()}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            asChild
                            className='rounded-full px-6 shadow-sm hover:shadow-md transition-shadow bg-primary text-primary-foreground pointer'
                        >
                            <Link href={'/sign-in'}>
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
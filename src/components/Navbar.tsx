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
        <nav className='p-4 md:p-6 shadow-md bg-black text-white'>
            <div className='container mx-auto flex  flex-col md:flex-row justify-between items-center'>

                <a className='text-xl font-bold md-4 md:mb-0 '
                    href="">Mystry Message</a>
                {session ? (<><span className='mr-4'> Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={() => signOut()}>
                        Logout
                    </Button>
                </>
                ) : (<Button asChild className='w-full md:w-auto bg-white text-black hover:bg-gray-100 pointer' >
                    <Link href={'/sign-in'}>
                        Login
                    </Link></Button>
                )}
            </div>
        </nav>
    )
}

export default Navbar
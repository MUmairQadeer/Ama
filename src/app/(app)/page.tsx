"use client"
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Messages from'@/messages.json'
import { Card, CardContent} from '@/components/ui/card'


 function Home() {
  
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center h-[82vh] px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>
          Dive into the World of Anonymous Feedback</h1>
        <p className='mt-3 md:mt-4 text-base text-sm md:text-lg'>
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      {/* //Carousel */}

    <Carousel 
    plugins={[Autoplay({ delay: 2000 })]}
    className="w-full max-w-xs  ">
      <CarouselContent className='  '>
      {
        Messages.map((message, index)=>(
           
          <CarouselItem key={index} className=''>
            <div className="p-1">
              <Card>
                
                <CardContent className="flex aspect-square w-full h-40 items-center justify-center  ">
                  <div className="main flex flex-col gap-2">
                  <div>
                    {message.title}
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </div>

                  <span className="text-lg font-bold w-full  ">{message.content}</span>
                  <span>{message.received}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )
        )
      }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>


    </main>
    <footer className='text-center p-4 md:p-6 bg-black text-white mb-0 sticky'>
      <p className='text-sm'>
        &copy; {new Date().getFullYear()} Mystery Message. All rights reserved.
      </p>
    </footer>
</>
  )
}

export default Home
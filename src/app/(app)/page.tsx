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
import Messages from '@/messages.json'
import { Card, CardContent } from '@/components/ui/card'


function Home() {

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-20 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950/50">
        <section className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent pb-2 max-w-4xl mx-auto leading-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 ease-out">
            True Feedback — Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel Section */}
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 ease-out">
          <div className="absolute inset-0 -z-10 bg-primary/10 blur-3xl rounded-full" />
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {
                Messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <Card className="border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardContent className="flex flex-col aspect-[4/3] w-full items-center justify-center p-8 text-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                          </div>
                          <h3 className="text-xl font-bold text-foreground">
                            {message.title}
                          </h3>
                          <p className="text-muted-foreground text-sm font-medium line-clamp-3">
                            "{message.content}"
                          </p>
                          <span className="text-xs text-muted-foreground mt-4 font-mono bg-muted/50 px-2 py-1 rounded-md">
                            {message.received}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
        </div>
      </main>

      <footer className="text-center p-6 border-t border-border/40 bg-slate-50 dark:bg-slate-950 text-muted-foreground">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} Mystery Message. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Home
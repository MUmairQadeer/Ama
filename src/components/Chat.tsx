'use client';
import { useState } from 'react';
import axios from 'axios';


interface ChatProps {
  setMessage: (message: string) => void;
}
export default function Chat({ setMessage }: ChatProps) {
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."


  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);



    const res = await axios.post("/api/chat", { prompt });
    const data = await res.data;
    const qs = data.response.split('||');
    setQuestions(qs);
    console.log(questions, "questions")
    setLoading(false);

  };


  return (
    <div className='w-full space-y-5'>

      <form onSubmit={handleSubmit} className='mb-6'>
        <button
          type='submit'
          disabled={loading}
          className='w-full px-6 py-3 bg-card border border-primary/20 hover:border-primary/50 hover:bg-muted/50 text-foreground font-medium rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group'
        >
          {loading ? (
            <div className="flex items-center text-primary">
              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></span>
              Generating Ideas...
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-primary group-hover:rotate-12 transition-transform duration-300"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              Suggest Messages
            </>
          )}
        </button>
      </form>

      {questions.length > 0 && (
        <div className='space-y-3 mt-4'>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-left px-1">Click to use an idea:</h3>
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => (
              <div
                key={index}
                onClick={() => setMessage(question)}
                className='bg-background/80 border border-border/40 hover:border-primary/40 hover:bg-primary/5 p-3.5 rounded-xl cursor-pointer text-sm md:text-base text-foreground/90 transition-all text-left shadow-sm hover:shadow-md'
              >
                "{question}"
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
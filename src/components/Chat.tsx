'use client';
import { useState } from 'react';
import axios from 'axios';


interface ChatProps {
  setMessage: (message: string) => void;
}
export default function Chat({setMessage}: ChatProps) {
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
    console.log(questions,"questions")
    setLoading(false);
    
  };


  return (
    <div className='p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4'>
      <div className='space-y-4 mb-4 max-h-96 overflow-y-auto'>
      {questions.map((question, index) => (
        <div key={index} onClick={() => setMessage(question)} className='bg-gray-100 p-4 rounded-md'>
          {question }
        </div>
      ))}
      </div>

      <form onSubmit={handleSubmit} className='space-y-4 text-black'>
       
        <button
          type='submit'
          className='w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 justify-center flex items-center'
        >
          {loading ? (
            <div 
            // className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'
             >Our Ai is thinking...</div>
          ) : (
            'Suggest Messages'
          )}
        </button>
      </form>
    </div>
  );
}
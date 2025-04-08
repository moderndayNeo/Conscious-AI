'use client';

import React, { useState } from 'react';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

type Message = {
  speaker: 'user' | 'assistant';
  message: string;
};

const dummyMessages: Message[] = [
  {
    speaker: 'user',
    message: 'List three brazilian jiu jitsu submissions',
  },
  {
    speaker: 'assistant',
    message:
      'Three brazilian jiu-jitsu submissions are: Guillotine Choke, Bow & Arrow Choke, and the Armbar from mount!',
  },
  {
    speaker: 'user',
    message: 'which of these is most effective in NoGi?',
  },
  {
    speaker: 'assistant',
    message:
      'The Guillotine Choke is the most effective submission in NoGi. It is a devastating chokehold that can be used to finish the fight quickly.',
  },
];

export function OpenAiInput() {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { speaker: 'user', message: inputValue.trim() },
      ]);
      setInputValue('');
    }
  };

  return (
    <div className="bg-[#252627] p-4 rounded-2xl border-2 border-[#464748] ">
      {/* Header */}
      <div className="border-b-2 border-[#464748] mb-4 p-4">
        <p className="text-white font-bold">Ask OpenAI</p>
        <button
          className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-2 rounded-full"
          onClick={() => {
            // Add functionality to close the component or clear the messages
            setMessages([]);
          }}
        >
          X
        </button>
      </div>

      {/* Messages list */}
      <div className="flex flex-col gap-4 mb-4">
        {messages.map((message) =>
          message.speaker === 'user' ? (
            <UserMessage message={message.message} key={message.message} />
          ) : (
            <AssistantMessage message={message.message} key={message.message} />
          )
        )}
      </div>

      {/* Chat input */}
      <div className="chat-input">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            name="message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="How else can I help?"
            className="w-full bg-[#1E1F20] text-white p-4 pr-14 rounded-xl border border-[#464748] focus:outline-none focus:border-purple-500 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors ${
              inputValue.trim()
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9]'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform -rotate-90 ${
                inputValue.trim() ? 'text-white' : 'text-gray-400'
              }`}
            >
              <path
                d="M12 4L20 12L12 20M20 12H4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

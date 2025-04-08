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
];

export function OpenAiInput() {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);

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
        <p className="text-purple-400">Ask anything you want!</p>
      </div>
    </div>
  );
}

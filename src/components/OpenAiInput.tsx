"use client";

import React, { useState } from "react";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { sendChatMessage } from "@/utils/api";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Message = {
	speaker: "user" | "assistant";
	message: string;
};

export function OpenAiInput() {
	const [messages, setMessages] = useState<Message[]>(
		// [],
		useLocalStorage<Message[]>("messages") || [],
	);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			setIsLoading(true);
			setError(null);

			try {
				const assistantResponse = await sendChatMessage(inputValue.trim());
				// Store the updated messages in localStorage
				const updatedMessages = [
					...messages,
					{ speaker: "user", message: inputValue.trim() },
					{ speaker: "assistant", message: assistantResponse },
				];
				window.localStorage.setItem(
					"messages",
					JSON.stringify(updatedMessages),
				);
				setMessages(updatedMessages as Message[]);
			} catch (e) {
				console.error("Error:", e);
				setError("Sorry, there was an error processing your request.");
			}

			setIsLoading(false);
			setInputValue("");
		}
	};

	return (
		<div className="bg-[#2526278c] p-4 rounded-2xl border-2 border-[#464748] min-w-[300px] sm:min-w-[500px]">
			{/* Header */}
			<div className="border-b-2 border-[#464748] mb-4 pb-2">
				<p className="text-white font-bold">Ask me any spiritual question...</p>
			</div>

			{/* Messages list */}
			<div className="flex flex-col gap-4 mb-4 sm:min-[150px]: min-h-[300px] max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2">
				{messages.map((message) =>
					message.speaker === "user" ? (
						<UserMessage message={message.message} key={message.message} />
					) : (
						<AssistantMessage message={message.message} key={message.message} />
					),
				)}
				{error && <div className="text-red-500 self-center">{error}</div>}
				{isLoading && (
					<div className="self-center">
						<svg
							className="animate-spin h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
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
						placeholder={
							messages.length === 0 ? "How can I help?" : "How else can I help?"
						}
						className="w-full bg-[#1E1F20] text-white p-4 pr-14 rounded-xl border border-[#464748] focus:outline-none focus:border-purple-500 placeholder-gray-500"
					/>
					<button
						type="submit"
						disabled={!inputValue.trim()}
						className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors
             ${
								inputValue.trim()
									? "bg-[#7C3AED] hover:bg-[#6D28D9] cursor-pointer"
									: "bg-gray-600 cursor-not-allowed"
							}`}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={`transform -rotate-90 ${
								inputValue.trim() ? "text-white" : "text-gray-400"
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

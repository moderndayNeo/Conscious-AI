"use client";

import React, { useEffect, useState } from "react";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { streamChatMessage } from "@/utils/api";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Message = {
	speaker: "user" | "assistant";
	message: string;
};

export function AiChatInput() {
	const [messages, setMessages] = useState<Message[]>(
		useLocalStorage<Message[]>("messages") || [],
	);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [streamingMessage, setStreamingMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			setIsLoading(true);
			setError(null);
			setStreamingMessage(""); // Reset streaming message

			try {
				const userMessage = inputValue.trim();
				const withUserMessage: Message[] = [
					...messages,
					{ speaker: "user", message: userMessage },
				];

				// Update messages with the new user message
				window.localStorage.setItem(
					"messages",
					JSON.stringify(withUserMessage),
				);
				setMessages(withUserMessage);
				setInputValue(""); // Clear input right away

				// Add an empty assistant message that will be streamed
				const withAssistantMessage: Message[] = [
					...withUserMessage,
					{ speaker: "assistant", message: "" },
				];
				setMessages(withAssistantMessage);

				// Start streaming the response
				await streamChatMessage(userMessage, (chunk) => {
					setStreamingMessage((prev) => prev + chunk);

					// Update the assistant's message in real-time
					setMessages((currentMessages) => {
						const updatedMessages = [...currentMessages];
						updatedMessages[updatedMessages.length - 1] = {
							speaker: "assistant",
							message:
								updatedMessages[updatedMessages.length - 1].message + chunk,
						};
						return updatedMessages;
					});
				});

				// When streaming completes, save the final state to localStorage
				const finalMessages: Message[] = [
					...withUserMessage,
					{ speaker: "assistant", message: streamingMessage },
				];
				window.localStorage.setItem("messages", JSON.stringify(finalMessages));
			} catch (e) {
				console.error("Error:", e);
				setError("Sorry, there was an error processing your request.");
			}

			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Scroll the messages section to the bottom
		const messagesContainer = document.querySelector(".messages-container");
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}, [messages, isLoading, streamingMessage]); // Add streamingMessage to dependencies

	return (
		<section className="bg-[#2526278c] p-4 rounded-2xl border-2 border-[#464748] lg:min-w-200 w-[95%]">
			{/* Header */}
			<div className="border-b-2 border-[#464748] mb-4 pb-2">
				<p className="text-white font-bold">Ask me any spiritual question...</p>
			</div>

			{/* Messages list */}
			<div className="messages-container flex flex-col gap-4 mb-4 sm:min-[150px]: min-h-[300px] max-h-[40vh] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2">
				{messages.map((message, index) =>
					message.speaker === "user" ? (
						<UserMessage message={message.message} key={index} />
					) : (
						<AssistantMessage message={message.message} key={index} />
					),
				)}
				{error && <div className="text-red-500 self-center">{error}</div>}
				{isLoading && !streamingMessage && (
					<div className="self-center flex flex-col items-center gap-2">
						<p className="text-white">
							Interesting question. Let me ruminate on that for a moment...
						</p>

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
						disabled={!inputValue.trim() || isLoading}
						className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors
             ${
								inputValue.trim() && !isLoading
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
								inputValue.trim() && !isLoading ? "text-white" : "text-gray-400"
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
		</section>
	);
}

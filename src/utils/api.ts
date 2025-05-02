/**
 * Sends a message to the AI chat API and returns the response
 * @param message - The user's message to send to the AI
 * @returns The AI's response
 */
export async function sendChatMessage(message: string): Promise<string> {
	try {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to send message");
		}

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Error sending chat message:", error);
		throw error;
	}
}

/**
 * Sends a message to the AI chat API and streams the response
 * @param message - The user's message to send to the AI
 * @param onChunk - Callback function that receives each chunk of the response
 * @returns A promise that resolves when the stream is complete
 */
export async function streamChatMessage(
	message: string,
	onChunk: (chunk: string) => void,
): Promise<void> {
	try {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to send message");
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("Failed to get response stream reader");
		}

		const decoder = new TextDecoder();
		let done = false;

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;

			if (value) {
				const chunk = decoder.decode(value, { stream: true });
				onChunk(chunk);
			}
		}
	} catch (error) {
		console.error("Error streaming chat message:", error);
		throw error;
	}
}

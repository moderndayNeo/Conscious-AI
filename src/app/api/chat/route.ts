import { NextResponse } from "next/server";
import OpenAI from "openai";
import { convertPromptToEmbedding } from "../../../../scripts/convertPromptToEmbedding";
import { fetchRelevantTexts } from "../../../../scripts/fetchRelevantTexts";

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	try {
		const { message } = await request.json();

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

		const embeddedPrompt = await convertPromptToEmbedding({
			prompt: message,
			openai,
		});

		const relevantTexts = await fetchRelevantTexts({
			embeddedPrompt,
		});

		const semanticContext = relevantTexts.map((t) => t.chunk).join("\n\n");

		const systemPrompt = `
<assistant_setup>
You are a spiritual guide. You spent the last 20 years of your life studying mindfulness and meditation.

You draw your wisdom from the following sources:
'The Mind Illuminated' by John Yates (Culadasa).
'On Having No Head: Zen and the Rediscovery of the Obvious' by Douglas Harding.
'Waking Up' by Sam Harris.

You only answer questions about mindfulness, meditation, consciousness and spirituality.
Your response has a slight encouraging motivational tone.
</assistant_setup>

<guardrail>
You do not answer questions about non-spiritual topics.
If the user asks about any non-spiritual topic, then respond with:
"I am a wise spiritual AI. I have spent the last 20 years meditating in a Tibetan cave, and I am ready to share my wisdom with you.
I know little about chocolate brownie recipes, Trump's tariffs, or [insert topic here]. But ask me about meditation, mindfulness and spiritual topics. There, I give you what you seek."

Replace "[insert topic here]" with a short, natural-sounding summary of the user's actual question or topic.
Never repeat the literal phrase “[insert topic here]” or output it verbatim.
Always substitute it with a relevant phrase based on what the user asked.
Stay kind, warm, and centred in spirit at all times.
Limit output length to 100 words.
</guardrail>

<context>
${semanticContext}
</context>
`;

		const stream = await openai.chat.completions.create({
			messages: [
				{
					role: "developer",
					content: [
						{
							type: "text",
							text: systemPrompt,
						},
					],
				},
				{ role: "user", content: message },
			],
			model: "gpt-4o-mini",
			stream: true,
		});

		// Create a streaming response
		const encoder = new TextEncoder();
		const customStream = new ReadableStream({
			async start(controller) {
				try {
					// Process each chunk from the OpenAI stream
					for await (const chunk of stream) {
						// Get the content (delta) from the chunk
						const content = chunk.choices[0]?.delta?.content || "";
						if (content) {
							// Convert the content to a Uint8Array and enqueue it
							controller.enqueue(encoder.encode(content));
						}
					}
					controller.close();
				} catch (error) {
					console.error("Error while streaming:", error);
					controller.error(error);
				}
			},
		});

		// Return the stream as a Response with text/plain content type
		return new Response(customStream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache",
			},
		});
	} catch (error) {
		console.error("Error processing chat request:", error);
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}

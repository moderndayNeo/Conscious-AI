import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function convertPromptToEmbedding({
	prompt,
	openai,
}: {
	prompt: string;
	openai: OpenAI;
}) {
	const embeddingResponse = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input: prompt,
	});

	const [{ embedding }] = embeddingResponse.data;

	return embedding;
}

// Testing the script
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const prompt = "What is the meaning of life?";
// const embedding = await convertPromptToEmbedding({ prompt, openai });
// console.log(embedding);

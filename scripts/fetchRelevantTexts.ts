import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
// import { convertPromptToEmbedding } from "./convertPromptToEmbedding.js";
import OpenAI from "openai";

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

export async function fetchRelevantTexts({
	embeddedPrompt,
}: {
	embeddedPrompt: number[];
}) {
	// Pass the embedding to the vector db, perform a similarity search.
	// Then return the top 5 most relevant texts.

	const supabaseClient = createClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
	);

	// Query Supabase with pgvector cosine similarity
	const { data, error } = await supabaseClient.rpc("match_documents", {
		query_embedding: embeddedPrompt,
		match_count: 10,
	});

	if (error) {
		throw new Error(`Similarity search failed: ${error.message}`);
	}

	return data as { chunk: string; similarity: number }[];
}

// Testing the script
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const embeddedPrompt = await convertPromptToEmbedding({
// 	prompt: "What is the meaning of life?",
// 	openai,
// });
// console.log({ embeddedPrompt });
// const result = await fetchRelevantTexts({ embeddedPrompt });
// console.log(result);

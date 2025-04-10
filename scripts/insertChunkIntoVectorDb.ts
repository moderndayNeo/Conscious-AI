// import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function insertChunkIntoVectorDb({
	chunk,
	openai,
	supabaseClient,
}: {
	chunk: string;
	openai: OpenAI;
	supabaseClient: SupabaseClient;
}) {
	// OpenAI recommends replacing newlines with spaces for best results
	const input = chunk.replace(/\n/g, " ");

	const embeddingResponse = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input,
	});

	const [{ embedding }] = embeddingResponse.data;

	console.log({ embedding });

	const result = await supabaseClient.from("documents").insert({
		content: chunk,
		embedding,
	});

	return result;
}

// Testing the script.
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const supabaseClient = createClient(
// 	process.env.SUPABASE_URL!,
// 	process.env.SUPABASE_ANON_KEY!,
// );
// const chunk =
// 	"Non-duality is a state of being that is free from all dualities.";

// const result = await insertChunkIntoVectorDb({
// 	chunk,
// 	openai,
// 	supabaseClient,
// });

// console.log(result);

// Successful result:
// {
//     error: null,
//     data: null,
//     count: null,
//     status: 201,
//     statusText: 'Created'
//   }

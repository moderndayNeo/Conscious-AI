import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";
// import { insertChunkIntoVectorDb } from "./insertChunkIntoVectorDb.js";
// import { convertTextToChunks } from "./convertTextToChunks.js";
// import { getBookTextContent } from "./getBookTextContent.js";
// import path from "path";
import { decode, encode } from "gpt-3-encoder";
import epubParser from "@gxl/epub-parser";
// import { fileURLToPath } from "url";

dotenv.config();

// NOTE: All scripts are moved into this file for performing the task of embedding a book into a vector database. This is to avoid conflicts with typescript imports and module import issues.

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

export function convertTextToChunks(
	text: string,
	chunkSize: number = 500, // Good enough to retain semantic meaning of the text
	overlap: number = 50, // Enough overlap to retain context between chunks
): string[] {
	const tokens = encode(text);
	const chunks: string[] = [];

	let i = 0;
	while (i < tokens.length) {
		const chunkTokens = tokens.slice(i, i + chunkSize);
		const chunkText = decode(chunkTokens);
		chunks.push(chunkText);
		i += chunkSize - overlap; // Slide window forward with overlap
	}

	return chunks;
}

export async function extractTextFromEpub({
	bookFilePath,
}: {
	bookFilePath: string;
}): Promise<string> {
	try {
		const epub = await epubParser.parseEpub(bookFilePath, {
			type: "path",
		});
		const bookSections = epub.sections;

		if (bookSections) {
			const text = bookSections
				.map((section) => {
					// @ts-expect-error - The toMarkdown method exists but TypeScript doesn't recognize it
					return section ? section.toMarkdown() : "";
				})
				.join(" ");
			return text;
		} else {
			return "No sections found";
		}
	} catch (error) {
		console.error("Error parsing EPUB file:", error);
		throw new Error(
			`Failed to parse EPUB file: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export async function getBookTextContent({
	bookFilePath,
}: {
	bookFilePath: string;
}): Promise<string> {
	if (bookFilePath.endsWith(".epub")) {
		return await extractTextFromEpub({ bookFilePath });
	} else {
		throw new Error("ERROR: Book is not in .epub format");
	}
}

async function embedBookChunksInVectorDb({
	bookFilePath,
}: {
	bookFilePath: string;
}) {
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

	const supabaseClient = createClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
	);

	console.log("Getting book text content...");
	const bookTextContent = await getBookTextContent({ bookFilePath });
	console.log({ bookTextContent });

	console.log("Converting text to chunks...");
	const chunks = convertTextToChunks(bookTextContent);
	console.log({ chunks });

	console.log("Embedding chunks into vector db...");
	// Assuming each document is a string
	for (const chunk of chunks) {
		await insertChunkIntoVectorDb({
			chunk,
			openai,
			supabaseClient,
		});
	}

	console.log("Embedding complete. Vectors inserted into vector db.");
}

/*
Testing the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookFilePath = path.resolve(
	__dirname,
	// "../books/Douglas_Edison_Harding-On_Having_No_Head-The_Shollond_Trust_(2013).epub",
	// "../books/John_Yates_(Culadasa),_with_J._Graves,_M._Immergut_-_The_Mind_Illuminated___A_Complete_Meditation_Guide_Integrating_Buddhist_Wisdom_and_Brain_Science_(2015).epub",
	// "../books/Sam_Harris-Waking_Up_A_Guide_to_Spirituality_Without_Religion-Simon_&_Schuster_(2014).epub",
);

embedBookChunksInVectorDb({ bookFilePath });
*/

import epubParser from "@gxl/epub-parser";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function extractTextFromEpub({
	bookFilePath,
}: {
	bookFilePath: string;
}): Promise<string> {
	try {
		const epub = await epubParser.parseEpub(bookFilePath, {
			type: "path",
		});

		if (epub.sections) {
			console.log(`Found ${epub.sections.length} sections`);

			const text = epub.sections
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

// Testing the script

// Use path.resolve to make the path relative to the script location
const bookFilePath = path.resolve(
	__dirname,
	"../../spiritual-books/Douglas_Edison_Harding-On_Having_No_Head-The_Shollond_Trust_(2013).epub",
);

const result = extractTextFromEpub({
	bookFilePath,
});

result
	.then((text) => console.log(text))
	.catch((error) => console.error("Error:", error));

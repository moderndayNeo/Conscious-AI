import { OpenAiInput } from "@/components/OpenAiInput";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen p-8 gap-2 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-10 sm:pt-10 lg:pt-32">
			<header className="flex flex-col items-center gap-2 mb-8">
				<h1 className="text-4xl font-bold">✨ Conscious AI ✨</h1>
				<p className="text-lg text-center">
					Is AI Conscious? Ask it… and see what answers arise.
				</p>
			</header>
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[70%]">
				<OpenAiInput />
			</main>
		</div>
	);
}

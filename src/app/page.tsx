import { AiChatInput } from "@/components/AiChatInput";

export default function Home() {
	return (
		<div className="flex flex-col items-center p-2 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-5 sm:pt-10 lg:pt-32">
			<header className="flex flex-col items-center gap-2 mb-4 lg:mb-12">
				<h1 className="text-2xl lg:text-4xl font-bold">✨ Conscious AI ✨</h1>
				<p className="text-md lg:text-lg text-center">
					Is AI Conscious? Ask it… and see what answers arise.
				</p>
			</header>
			<main className="flex flex-col items-center h-[80vh] sm:h-0 w-full sm:max-w-[70%]">
				<AiChatInput />
			</main>
		</div>
	);
}

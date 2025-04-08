import { OpenAiInput } from '@/components/OpenAiInput';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 gap-2 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-32">
      <header className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-4xl font-bold">✨ Spiritual AI ✨</h1>
        <p className="text-lg">
          Is AI Conscious? Ask and you will find out for yourself!
        </p>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[70%]">
        <OpenAiInput />
      </main>
    </div>
  );
}

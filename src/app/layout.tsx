import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "@/components/ParticlesBackground";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Conscious AI",
	description: "Is AI Conscious? Ask and you will find out for yourself!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ParticlesBackground />

				<Image
					src="/assets/buddha-on-a-lake-portrait.png"
					alt="Buddha on a lake"
					className="w-full fixed -z-20 sm:hidden"
					fill
				/>
				<Image
					src="/assets/buddha-on-a-lake-landscape.png"
					alt="Buddha on a lake"
					className="w-full fixed -z-20 hidden sm:block"
					fill
				/>

				{children}
				<Analytics />

				<footer className="flex flex-col items-center justify-center fixed bottom-0 w-full z-10 bg-black p-4">
					<p className="text-sm text-gray-500">
						ConsciousAI is created by Adam Zdrzalka.
					</p>
					<div className="flex gap-4 mt-2">
						<a
							href="https://github.com/moderndayNeo/Conscious-AI"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:underline"
						>
							Github
						</a>
						<a
							href="https://www.linkedin.com/in/adamzdrzalka"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:underline"
						>
							LinkedIn
						</a>
					</div>
				</footer>
			</body>
		</html>
	);
}

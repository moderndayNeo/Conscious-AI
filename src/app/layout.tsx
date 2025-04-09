import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "@/components/ParticlesBackground";
import Image from "next/image";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Spiritual AI",
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
			</body>
		</html>
	);
}

import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";

import "@/styles/globals.css";

import Header from "@/components/Header";
import TransitionProvider from "@/components/TransitionProvider";
import { getAccentColor } from "@/sanity/lib/accent";

const lexend = Lexend({
	variable: "--font-lexend",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "Stuyvesant Sophomore Caucus",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const accent = await getAccentColor();
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,ROND,slnt,wdth,wght@6..144,0..100,-10..0,25..151,1..1000&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body
				className={`${lexend.variable} antialiased`}
				style={{ "--color-accent": accent } as React.CSSProperties}
			>
				<Header />
				<TransitionProvider>{children}</TransitionProvider>
			</body>
		</html>
	);
}

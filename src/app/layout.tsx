import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";

import "@/styles/globals.css";

import Header from "@/components/Header";
import TransitionProvider from "@/components/TransitionProvider";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;700;900&display=swap" rel="stylesheet" />
			</head>
			<body className={`${lexend.variable} antialiased`}>
				<Header />
				<TransitionProvider>{children}</TransitionProvider>
			</body>
		</html>
	);
}

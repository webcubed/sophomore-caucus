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
	title: "Stuyvesant Freshman Caucus",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className="dark"
			data-catppuccin="mocha"
			suppressHydrationWarning
		>
			<body className={`${lexend.variable} antialiased`}>
				<Header />
				<TransitionProvider>{children}</TransitionProvider>
			</body>
		</html>
	);
}

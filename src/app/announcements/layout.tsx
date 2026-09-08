import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";

export default function AnnouncementsLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
				<PageHero
					title="Announcements"
					description="someone tell me what to write here"
				/>
				{children}
			</div>
		</main>
	);
}

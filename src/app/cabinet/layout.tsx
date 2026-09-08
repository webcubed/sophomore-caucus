import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";

export default function CabinetLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<div className="flex w-full flex-col gap-8 sm:gap-10">
				<PageHero
					title="Cabinet"
					description="Tap a profile to view full contact details."
				/>
				{children}
			</div>
		</main>
	);
}

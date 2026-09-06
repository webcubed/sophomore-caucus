import type { LucideIcon } from "lucide-react";
import Announcements from "@/components/Announcements";
import { Stagger } from "@/components/TransitionProvider";
import {
	CalendarClock,
	ClipboardList,
	Megaphone,
	MessageSquare,
	Newspaper,
	Orbit,
} from "lucide-react";

type NavCard = {
	title: string;
	description: string;
	icon: LucideIcon;
	href: string;
};

const cards: NavCard[] = [
	{
		title: "Announcements",
		description: "Latest updates from the caucus",
		icon: Megaphone,
		href: "/announcements",
	},
	{
		title: "Events",
		description: "This month's events",
		icon: CalendarClock,
		href: "/events",
	},
	{
		title: "Cabinet",
		description: "Meet our team",
		icon: Orbit,
		href: "/cabinet",
	},
	{
		title: "News",
		description: "What we've been up to",
		icon: Newspaper,
		href: "/cabinet",
	},
	{
		title: "Feedback",
		description: "Tell us anything",
		icon: MessageSquare,
		href: "https://docs.google.com/forms/d/e/1FAIpQLScM69jAj1Ll80oeZ7H8cR0FmxF8p0Ew7oyYmFlXV1rQm0KhmA/viewform",
	},
	{
		title: "Megadoc",
		description: "What we're working on",
		icon: ClipboardList,
		href: "https://docs.google.com/document/d/1rKev2mfD8JBfKP8Gy041SyP9LuY5IfzPFf7WTRyMnNI/edit?tab=t.0",
	},
];

export default function Home() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center gap-16 px-6 py-24 sm:py-32">
			<div className="text-center">
				<Stagger>
					<h1 className="text-4xl font-bold sm:text-5xl">Sophomore Caucus</h1>
				</Stagger>
				<Stagger>
					<p className="mt-3">2026-2027</p>
				</Stagger>
			</div>
			<div className="grid w-full max-w-4xl auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => (
					<Stagger key={card.title}>
						<a
							href={card.href}
							className="flex h-full items-start gap-3 rounded-lg border border-overlay1/60 bg-surface0/50 p-4 transition-colors hover:bg-surface1/60"
						>
							<card.icon className="mt-0.5 h-5 w-5 shrink-0 text-subtext0" />
							<div className="min-w-0">
								<h2 className="text-sm font-semibold">{card.title}</h2>
								<p className="mt-0.5 text-xs text-subtext0">
									{card.description}
								</p>
							</div>
						</a>
					</Stagger>
				))}
			</div>{" "}
			<Announcements />
		</main>
	);
}

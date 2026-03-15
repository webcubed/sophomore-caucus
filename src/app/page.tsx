import type { LucideIcon } from "lucide-react";
import { Stagger } from "@/components/TransitionProvider";
import { HeroCard } from "@/components/ui/HeroCard";
import {
	BookOpen,
	CalendarClock,
	ClipboardList,
	HandHeart,
	Megaphone,
	MessageSquare,
	Newspaper,
	Orbit,
	ShelvingUnit,
	Sparkles,
	Toolbox,
	Users,
} from "lucide-react";

type heroCard = {
	spacer?: false;
	title: string;
	description?: string;
	icon?: LucideIcon;
	height: number;
	width: number;
	href: string;
};
type spacerItem = {
	spacer: true;
	height: number;
	width: number;
	className?: string;
};

type gridItem = heroCard | spacerItem;

const heroCards: gridItem[] = [
	{
		title: "Announcements",
		description: "Latest updates",
		height: 1,
		width: 2,
		icon: Megaphone,
		href: "/cabinet",
	},
	{
		title: "Events",
		description: "This month",
		height: 1,
		width: 2,
		icon: CalendarClock,
		href: "/cabinet",
	},

	{
		title: "Meet our cabinet",
		description: "Who we are",
		height: 2,
		width: 3,
		icon: ShelvingUnit,
		href: "/cabinet",
	},
	{
		title: "News",
		description: "What we're doing",
		height: 1,
		width: 2,
		icon: Newspaper,
		href: "/cabinet",
	},
	{
		title: "Feedback",
		description: "Tell us anything",
		height: 2,
		width: 1,
		icon: MessageSquare,
		href: "/cabinet",
	},
	{
		title: "Projects",
		description: "What we're building",
		height: 1,
		width: 1,
		icon: ClipboardList,
		href: "/cabinet",
	},
	{
		title: "Resources",
		description: "Useful links",
		height: 1,
		width: 2,
		icon: Toolbox,
		href: "/resources",
	},
	{
		title: "Contact",
		description: "Our socials",
		height: 1,
		width: 1,
		icon: Users,
		href: "/contact",
	},
	// Example spacer (disabled): reserve an empty 1x1 slot by uncommenting.
	// { spacer: true, height: 1, width: 1 },
];

export default function Home() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-start gap-36 px-6 sm:py-32 sm:items-start">
			<div className="text-center mx-auto">
				<Stagger>
					<h1>Freshman Caucus</h1>
				</Stagger>
				<Stagger>
					<p className="mt-3 sm:mt-4">
						Stuyvesant High School's Freshman Caucus 2025-2026
					</p>
				</Stagger>
			</div>
			<div className="mx-auto grid w-full max-w-7xl grid-flow-dense auto-rows-[10.25rem] grid-cols-2 gap-4 rounded-lg border border-ctp-overlay1/60 bg-ctp-mantle/60 px-4 py-6 backdrop-blur-2xl sm:w-[94%] sm:grid-cols-4 sm:gap-5 sm:px-8 sm:py-8 lg:w-[90%] lg:grid-cols-6 lg:gap-6 lg:px-10 lg:py-10 xl:w-[86%]">
				{heroCards.map((item, index) => {
					if ("spacer" in item && item.spacer) {
						return (
							<div
								key={`spacer-${index}`}
								aria-hidden="true"
								className={`pointer-events-none select-none opacity-0 ${item.className ?? ""}`}
								style={{
									gridColumn: `span ${item.width} / span ${item.width}`,
									gridRow: `span ${item.height} / span ${item.height}`,
								}}
							/>
						);
					}

					return (
						<HeroCard
							key={`card-${index}-${item.title}`}
							title={item.title}
							description={item.description}
							height={item.height}
							width={item.width}
							icon={item.icon}
							href={item.href}
						/>
					);
				})}
			</div>
		</main>
	);
}

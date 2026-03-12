import { Stagger } from "@/components/TransitionProvider";
import { Card } from "@/components/ui/Card";
import { HeroCard } from "@/components/ui/HeroCard";
import { type LucideIcon } from "lucide-react";

type heroCard = {
	title: string;
	icon?: LucideIcon;
	height: number;
	width: number;
};
const heroCards: heroCard[] = [];

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
			<div className="grid bg-ctp-mantle/60 border border-ctp-overlay1/60 from-ctp-surface0/75 via-ctp-base/65 to-ctp-surface0/55 w-full h-max rounded-lg backdrop-blur-2xl px-8 sm:px-16 py-12">
				{heroCards.map((heroCard, index) => (
					<HeroCard
						key={index}
						title={heroCard.title}
						height={heroCard.height}
						width={heroCard.width}
						icon={heroCard.icon}
					/>
				))}
			</div>
		</main>
	);
}

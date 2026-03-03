import { Card } from "@/components/Card";
import { Stagger } from "@/components/TransitionProvider";

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
			<div className="bg-ctp-mantle flex w-full h-max rounded-lg px-8 sm:px-16 py-12">
				<Card>ni hao</Card>
			</div>
		</main>
	);
}

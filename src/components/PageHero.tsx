import { Stagger } from "@/components/TransitionProvider";

type PageHeroProps = {
	title: string;
	description?: string;
	className?: string;
};

export function PageHero({ title, description, className }: PageHeroProps) {
	return (
		<section className={`text-center ${className ?? ""}`.trim()}>
			<Stagger>
				<h1>{title}</h1>
			</Stagger>
			{description ? (
				<Stagger>
					<p className="mx-auto mt-4 max-w-2xl text-balance text-subtext1">
						{description}
					</p>
				</Stagger>
			) : null}
		</section>
	);
}

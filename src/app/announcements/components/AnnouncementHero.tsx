import { Stagger } from "@/components/TransitionProvider";

type AnnouncementHeroProps = {
	description: string;
};

export function AnnouncementHero({ description }: AnnouncementHeroProps) {
	return (
		<section className="text-center">
			<Stagger>
				<h1 className="mt-3 text-4xl font-bold sm:text-5xl">Announcements</h1>
			</Stagger>
			<Stagger>
				<p className="mx-auto mt-4 max-w-2xl text-balance text-subtext1">
					{description}
				</p>
			</Stagger>
		</section>
	);
}

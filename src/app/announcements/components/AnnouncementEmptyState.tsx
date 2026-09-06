import { Stagger } from "@/components/TransitionProvider";

export function AnnouncementEmptyState() {
	return (
		<section className="rounded-2xl border border-overlay0/70 bg-crust/40 p-8 text-center backdrop-blur-sm sm:p-10">
			<Stagger>
				<h2 className="text-xl font-semibold text-text">
					No announcements yet
				</h2>
			</Stagger>
			<Stagger>
				<p className="mt-3 text-subtext1">
					Check back soon for the latest caucus updates.
				</p>
			</Stagger>
		</section>
	);
}

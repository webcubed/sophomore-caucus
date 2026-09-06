import type { Announcement } from "../lib";
import { Stagger } from "@/components/TransitionProvider";
import { AnnouncementCard } from "./AnnouncementCard";

type AnnouncementListProps = {
	announcements: Announcement[];
};

export function AnnouncementList({ announcements }: AnnouncementListProps) {
	if (announcements.length === 0) return null;

	return (
		<section className="space-y-4">
			<Stagger>
				<h2 className="text-xl font-semibold text-text">Older announcements</h2>
			</Stagger>
			<div className="grid gap-4">
				{announcements.map((announcement) => (
					<AnnouncementCard
						key={announcement._id}
						announcement={announcement}
					/>
				))}
			</div>
		</section>
	);
}

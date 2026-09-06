import type { Metadata } from "next";
import type { Announcement } from "./lib";
import { client } from "@/sanity/lib/client";
import { AnnouncementEmptyState } from "./components/AnnouncementEmptyState";
import { AnnouncementFeaturedCard } from "./components/AnnouncementFeaturedCard";
import { AnnouncementHero } from "./components/AnnouncementHero";
import { AnnouncementList } from "./components/AnnouncementList";

export const metadata: Metadata = {
	title: "Announcements",
	description: "Latest updates from the Sophomore Caucus.",
};

async function getAnnouncements(): Promise<Announcement[]> {
	return client.fetch<Announcement[]>(
		`*[_type == "announcement"] | order(date desc) {
		  _id,
		  title,
		  date,
		  content,
		  flyer
		}`,
		{},
		{ next: { revalidate: 60 } }
	);
}

export default async function AnnouncementsPage() {
	const announcements = await getAnnouncements();
	const latestAnnouncement = announcements[0];
	const remainingAnnouncements = announcements.slice(1);

	return (
		<main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
				<AnnouncementHero description="someone tell me what to write here" />

				{announcements.length === 0 ? (
					<AnnouncementEmptyState />
				) : (
					<>
						<AnnouncementFeaturedCard announcement={latestAnnouncement} />
						<AnnouncementList announcements={remainingAnnouncements} />
					</>
				)}
			</div>
		</main>
	);
}

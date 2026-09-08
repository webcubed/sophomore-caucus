import type { Metadata } from "next";
import type { Announcement } from "./lib";
import { client } from "@/sanity/lib/client";
import { AnnouncementEmptyState } from "./components/AnnouncementEmptyState";
import { AnnouncementFeaturedCard } from "./components/AnnouncementFeaturedCard";
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
		<>
			{announcements.length === 0 ? (
				<AnnouncementEmptyState />
			) : (
				<>
					<AnnouncementFeaturedCard announcement={latestAnnouncement} />
					<AnnouncementList announcements={remainingAnnouncements} />
				</>
			)}
		</>
	);
}

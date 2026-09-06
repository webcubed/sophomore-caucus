import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export type Announcement = {
	_id: string;
	title: string;
	date: string;
	content: PortableTextBlock[] | null;
	flyer?: SanityImageSource;
};

export function formatAnnouncementDate(date: string): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { formatAnnouncementDate } from "../lib";

type AnnouncementBodyProps = {
	title: string;
	date: string;
	content: PortableTextBlock[] | null;
	dateClassName?: string;
	titleClassName?: string;
	bodyClassName?: string;
	emptyTextClassName?: string;
};

export function AnnouncementBody({
	title,
	date,
	content,
	dateClassName = "text-xs font-medium uppercase tracking-[0.18em] text-subtext0",
	titleClassName = "mt-3 text-lg font-semibold text-text sm:text-xl",
	bodyClassName = "prose prose-invert prose-sm mt-4 max-w-none text-subtext1 prose-headings:text-text prose-a:text-accent prose-strong:text-text",
	emptyTextClassName = "mt-4 text-subtext1",
}: AnnouncementBodyProps) {
	return (
		<>
			<time className={dateClassName}>{formatAnnouncementDate(date)}</time>
			<h3 className={titleClassName}>{title}</h3>
			{content?.length ? (
				<div className={bodyClassName}>
					<PortableText value={content} />
				</div>
			) : (
				<p className={emptyTextClassName}>
					No additional details were included with this post.
				</p>
			)}
		</>
	);
}

import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

type Announcement = {
	_id: string;
	title: string;
	date: string;
	content: PortableTextBlock[];
	flyer?: SanityImageSource;
};

async function getAnnouncements(): Promise<Announcement[]> {
	const query = `*[_type == "announcement"] | order(date desc) {
    _id,
    title,
    date,
    content,
    flyer
  }`;

	return client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function Announcements() {
	const announcements = await getAnnouncements();

	if (!announcements || announcements.length === 0) {
		return (
			<div className="py-12 text-center text-subtext0">
				No announcements posted yet.
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
			<h2 className="text-2xl font-bold tracking-tight text-text">
				Latest Announcements
			</h2>

			<div className="grid gap-6">
				{announcements.map((post) => (
					<article
						key={post._id}
						className="flex flex-col md:flex-row gap-6 rounded-xl border border-overlay1 bg-surface0/60 p-6 backdrop-blur"
					>
						{/* Optional Flyer / Image */}
						{post.flyer && (
							<div className="relative h-48 w-full md:w-56 shrink-0 overflow-hidden rounded-lg bg-surface0">
								<Image
									src={urlFor(post.flyer).width(600).url()}
									alt={post.title}
									fill
									className="object-cover"
								/>
							</div>
						)}

						<div className="flex flex-1 flex-col justify-between">
							<div>
								<div className="flex items-center gap-3 mb-2">
									<time className="text-xs text-subtext0">
										{new Date(post.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</time>
								</div>

								<h3 className="text-xl font-semibold text-text mb-3">
									{post.title}
								</h3>

								<div className="prose prose-invert prose-sm text-subtext1 max-w-none">
									<PortableText value={post.content} />
								</div>
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

import type { Announcement } from "../lib";
import { Stagger } from "@/components/TransitionProvider";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { AnnouncementBody } from "./AnnouncementBody";

type AnnouncementCardProps = {
	announcement: Announcement;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
	return (
		<Stagger>
			<article className="overflow-hidden rounded-2xl border border-overlay0/70 bg-surface0/45 backdrop-blur-sm">
				<div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_280px]">
					<div className="p-5 sm:p-6">
						<AnnouncementBody
							title={announcement.title}
							date={announcement.date}
							content={announcement.content}
						/>
					</div>

					{announcement.flyer ? (
						<div className="relative min-h-52 border-t border-overlay0/60 bg-surface0 md:min-h-full md:border-l md:border-t-0">
							<div className="relative aspect-16/10 h-full w-full md:aspect-auto md:min-h-full">
								<Image
									src={urlFor(announcement.flyer).width(1000).url()}
									alt={announcement.title}
									fill
									sizes="(min-width: 768px) 280px, 100vw"
									className="object-cover"
								/>
							</div>
						</div>
					) : null}
				</div>
			</article>
		</Stagger>
	);
}

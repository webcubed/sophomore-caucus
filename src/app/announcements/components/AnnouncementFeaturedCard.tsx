import type { Announcement } from "../lib";
import { Stagger } from "@/components/TransitionProvider";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { AnnouncementBody } from "./AnnouncementBody";

type AnnouncementFeaturedCardProps = {
	announcement: Announcement;
};

export function AnnouncementFeaturedCard({
	announcement,
}: AnnouncementFeaturedCardProps) {
	return (
		<section className="rounded-2xl border border-overlay0/70 bg-crust/40 p-4 backdrop-blur-sm sm:p-6 lg:p-8">
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
				<div className="order-2 lg:order-1">
					<Stagger>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtext0">
							Latest post
						</p>
					</Stagger>
					<Stagger>
						<h2 className="mt-3 text-2xl font-semibold text-text sm:text-3xl">
							{announcement.title}
						</h2>
					</Stagger>
					<Stagger>
						<div className="mt-3">
							<AnnouncementBody
								title={announcement.title}
								date={announcement.date}
								content={announcement.content}
								titleClassName="sr-only"
								bodyClassName="prose prose-invert prose-sm mt-5 max-w-none text-subtext1 sm:prose-base prose-headings:text-text prose-a:text-accent prose-strong:text-text"
								emptyTextClassName="mt-5 text-subtext1"
							/>
						</div>
					</Stagger>
				</div>

				{announcement.flyer ? (
					<Stagger className="order-1 lg:order-2">
						<div className="relative overflow-hidden rounded-xl border border-overlay1/50 bg-surface0">
							<div className="relative aspect-4/5 w-full sm:aspect-16/10 lg:aspect-4/5">
								<Image
									src={urlFor(announcement.flyer).width(1200).url()}
									alt={announcement.title}
									fill
									sizes="(min-width: 1024px) 360px, (min-width: 640px) 100vw, 100vw"
									loading="eager"
									className="object-cover"
								/>
							</div>
						</div>
					</Stagger>
				) : null}
			</div>
		</section>
	);
}

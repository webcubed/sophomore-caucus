import type { MacchiatoColor } from "@/lib/macchiato";
import type { SanityImageSource } from "@sanity/image-url";
import { ExpandableImage } from "@/components/ExpandableImage";
import { MACCHIATO } from "@/lib/macchiato";
import { urlFor } from "@/sanity/lib/image";

export type UpcomingEventProps = {
	first?: boolean;
	color: MacchiatoColor;
	eventName: string;
	date: string;
	room?: number | null;
	description: string;
	image?: SanityImageSource | null;
	onSelect?: () => void;
};

export default function UpComingEvent({
	first,
	color,
	eventName,
	date,
	room,
	description,
	image,
	onSelect,
}: UpcomingEventProps) {
	const hex = MACCHIATO[color];
	const thumbSrc = image ? urlFor(image).width(800).url() : null;
	const fullSrc = image ? urlFor(image).width(1600).url() : null;
	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	return (
		<div
			role={onSelect ? "button" : undefined}
			tabIndex={onSelect ? 0 : undefined}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (onSelect && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					onSelect();
				}
			}}
			className={`rounded-2xl border-2 ${
				first ? "border-4" : ""
			} bg-surface0 p-7 ${
				onSelect
					? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
					: ""
			}`}
			style={{ borderColor: hex, color: hex }}
		>
			<h3 className="text-xl font-semibold">{eventName}</h3>
			<div className="my-2 border-b border-overlay0/60"></div>
			<p>{formattedDate}</p>
			{room && <p>Room: {room}</p>}
			<div className="my-2"></div>
			<p className="text-sm">{description}</p>
			{thumbSrc && fullSrc && (
				<ExpandableImage
					src={fullSrc}
					alt={eventName}
					label={`View full image of ${eventName}`}
					className="mt-4 block w-full cursor-pointer overflow-hidden rounded-xl"
				>
					<img
						src={thumbSrc}
						alt={eventName}
						loading="lazy"
						className="w-full"
					/>
				</ExpandableImage>
			)}
		</div>
	);
}

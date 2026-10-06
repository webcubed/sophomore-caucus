import type { SanityImageSource } from "@sanity/image-url";
import { ExpandableImage } from "@/components/ExpandableImage";
import { urlFor } from "@/sanity/lib/image";

export type UpcomingEventProps = {
	first?: boolean;
	colorNum: number;
	eventName: string;
	date: string;
	room?: number | null;
	description: string;
	image?: SanityImageSource | null;
	onSelect?: () => void;
};

function getColor(colorNum: number, aspect: string) {
	let colors = [
		"blue",
		"mauve",
		"sapphire",
		"peach",
		"green",
		"yellow",
		"lavender",
		"teal",
		"red",
	];
	return `${aspect}-${colors[colorNum]}`;
}

export default function UpComingEvent({
	first,
	colorNum,
	eventName,
	date,
	room,
	description,
	image,
	onSelect,
}: UpcomingEventProps) {
	const borderColor = getColor(colorNum, "border");
	const textColor = getColor(colorNum, "text");
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
			className={`${borderColor} ${textColor} rounded-2xl border-2 ${
				first ? "border-4" : ""
			} bg-surface0 p-7 ${
				onSelect
					? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
					: ""
			}`}
		>
			<h3 className="text-xl font-semibold">{eventName}</h3>
			<div className="my-2 border-b border-overlay0/60"></div>
			<p className={textColor}>{formattedDate}</p>
			{room && <p className={textColor}>Room: {room}</p>}
			<div className="my-2"></div>
			<p className={textColor + " text-sm"}>{description}</p>
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

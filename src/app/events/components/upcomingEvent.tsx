import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export type UpcomingEventProps = {
	first: boolean;
	colorNum: number;
	eventName: string;
	date: string;
	room?: number | null;
	description: string;
	image?: SanityImageSource | null;
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
}: UpcomingEventProps) {
	const borderColor = getColor(colorNum, "border");
	const textColor = getColor(colorNum, "text");
	return (
		<div
			className={`${borderColor} ${textColor} mb-8 rounded-2xl border-2 ${
				first ? "border-4" : ""
			} bg-surface0 p-7`}
		>
			<h3 className="text-xl font-semibold">{eventName}</h3>
			<div className="my-2 border-b border-overlay0/60"></div>
			<p className={textColor}>{date}</p>
			{room && <p className={textColor}>Room: {room}</p>}
			<div className="my-2"></div>
			<p className={textColor + " text-sm"}>{description}</p>
			{image ? (
				<Image
					src={urlFor(image).width(800).url()}
					alt={eventName}
					width={800}
					height={600}
					className="mt-4 w-full rounded-xl object-cover"
				/>
			) : null}
		</div>
	);
}

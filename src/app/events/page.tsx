import type { MacchiatoColor } from "@/lib/macchiato";
import type { EventItem } from "./components/EventsView";
import { Stagger } from "@/components/TransitionProvider";
import { MACCHIATO } from "@/lib/macchiato";
import { client } from "../../sanity/lib/client";
import EventsView from "./components/EventsView";

// Rotating fallback for events without a chosen color.
const PALETTE: MacchiatoColor[] = [
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

type RawEvent = Omit<EventItem, "color"> & { color?: string | null };

export default async function Events() {
	const rawEvents = await client.fetch<RawEvent[]>(
		'*[_type == "event"] | order(date asc)'
	);
	if (rawEvents.length === 0) {
		return (
			<Stagger>
				<section className="rounded-2xl border border-overlay0/70 bg-crust/40 p-8 text-center backdrop-blur-sm sm:p-10">
					<h2 className="text-xl font-semibold text-text">
						No upcoming events.
					</h2>
				</section>
			</Stagger>
		);
	}
	const events: EventItem[] = rawEvents.map((event, index) => ({
		...event,
		color:
			event.color && event.color in MACCHIATO
				? (event.color as MacchiatoColor)
				: PALETTE[index % PALETTE.length],
	}));
	return (
		<Stagger>
			<EventsView events={events} />
		</Stagger>
	);
}

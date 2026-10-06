import type { EventItem } from "./components/EventsView";
import { Stagger } from "@/components/TransitionProvider";
import { client } from "../../sanity/lib/client";
import EventsView from "./components/EventsView";

export default async function Events() {
	const rawEvents = await client.fetch<Omit<EventItem, "colorNum">[]>(
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
		colorNum: index % 9,
	}));
	return (
		<Stagger>
			<EventsView events={events} />
		</Stagger>
	);
}

import UpComingEvent from "./components/upcomingEvent";
import { client } from "../../sanity/lib/client";
import { UpcomingEventProps } from "./components/upcomingEvent";
import Calendar from "./components/Calendar";

export default async function Events() {
	const events = await client.fetch('*[_type == "event"]');
	events.sort((a: UpcomingEventProps, b: UpcomingEventProps) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateA.getTime() - dateB.getTime();
	});
	const coloredEvents = events.map((event : UpcomingEventProps, index: number) => ({
  		...event,
  		colorNum: index % 9,
	}));
	if (events.length === 0) {
		return (
			<div className="text-center">
				<h2>No upcoming events.</h2>
			</div>
		)
	}
	return (
		<div className="flex gap-8">
			<div className="w-1/2 mx-0">{coloredEvents.map((event : {_id: string} & UpcomingEventProps, index: number) => (
				<UpComingEvent
					key={event._id}
					colorNum={event.colorNum}
					eventName={event.eventName}
					date={new Date(event.date).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true
					})}
					room={event.room}
					description={event.description}
					image={event.image}
				/>
			))}</div>
			<div className="w-1/2">
				<Calendar events={coloredEvents}/>
			</div>
		</div>
	);
}

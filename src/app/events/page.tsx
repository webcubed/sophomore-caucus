import UpComingEvent from "./components/upcomingEvent";
import { client } from "../../sanity/lib/client";
import { UpcomingEventProps } from "./components/upcomingEvent";

export default async function Events() {
	const events = await client.fetch('*[_type == "event"]');
	return (
		<>
			{events.map((event : {_id: string} & UpcomingEventProps, index: number) => (
				<UpComingEvent
					key={event._id}
					colorNum={index % 9}
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
			))}
		</>
	);
}

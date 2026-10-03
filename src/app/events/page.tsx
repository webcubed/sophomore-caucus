import UpComingEvent from "./components/upcomingEvent";
import { client } from "../../sanity/lib/client";
import { UpcomingEventProps } from "./components/upcomingEvent";
import Calendar from "./components/Calendar";
import { Stagger } from "@/components/TransitionProvider";

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
		first: index === 0,
	}));
	if (events.length === 0) {
		return (
			<div className="text-center">
				<h2>No upcoming events.</h2>
			</div>
		)
	}
	return (
		<Stagger>
			<div className="flex flex-col md:flex-row gap-8 divide-y-1 md:divide-x-1 md:divide-y-0 divide-solid divide-gray-500">
				<div className="w-full md:w-1/2 pb-8 justify-start">
					<Calendar events={coloredEvents}/>
				</div>
				<div className="w-full md:w-1/2 mx-0">{coloredEvents.map((event : {_id: string} & UpcomingEventProps, index: number) => (
					<Stagger key={event._id}>
						<UpComingEvent
							key={event._id}
							first={event.first}
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
					</Stagger>
				))}</div>
			</div>
		</Stagger>
	);
}

"use client";

import type { MacchiatoColor } from "@/lib/macchiato";
import type { SanityImageSource } from "@sanity/image-url";
import { Stagger } from "@/components/TransitionProvider";
import { useRef, useState } from "react";
import Calendar from "./Calendar";
import UpComingEvent from "./upcomingEvent";

export type EventItem = {
	_id: string;
	eventName: string;
	date: string;
	room?: number | null;
	description: string;
	image?: SanityImageSource | null;
	color: MacchiatoColor;
};

function monthIndex(d: Date): number {
	return d.getFullYear() * 12 + d.getMonth();
}

export default function EventsView({ events }: { events: EventItem[] }) {
	const [selectedId, setSelectedId] = useState(events[0]._id);
	const [cursor, setCursor] = useState(() => new Date());
	const [dir, setDir] = useState<1 | -1>(1);
	const [selectedDate, setSelectedDate] = useState(
		() => new Date(events[0].date)
	);
	const topRef = useRef<HTMLDivElement>(null);

	const selected = events.find((e) => e._id === selectedId) ?? events[0];
	const others = events.filter((e) => e._id !== selected._id);

	function changeCursor(next: Date) {
		setDir(monthIndex(next) >= monthIndex(cursor) ? 1 : -1);
		setCursor(next);
	}

	function selectEvent(event: EventItem, scroll: boolean) {
		const d = new Date(event.date);
		setSelectedId(event._id);
		setSelectedDate(d);
		changeCursor(new Date(d.getFullYear(), d.getMonth(), 1));
		if (scroll) {
			topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	function selectDate(date: Date) {
		setSelectedDate(date);
		const event = events.find((e) => sameDay(new Date(e.date), date));
		if (event) setSelectedId(event._id);
	}

	return (
		<div className="flex flex-col gap-10">
			<div ref={topRef} className="grid items-start gap-8 md:grid-cols-2">
				<Calendar
					events={events}
					cursor={cursor}
					dir={dir}
					onCursorChange={changeCursor}
					selectedDate={selectedDate}
					onSelectDate={selectDate}
				/>
				<Stagger>
					<UpComingEvent
						first
						color={selected.color}
						eventName={selected.eventName}
						date={selected.date}
						room={selected.room}
						description={selected.description}
						image={selected.image}
						onSelect={() => selectEvent(selected, false)}
					/>
				</Stagger>
			</div>
			{others.length > 0 && (
				<div className="flex flex-col gap-8">
					{others.map((event) => (
						<Stagger key={event._id}>
							<UpComingEvent
								color={event.color}
								eventName={event.eventName}
								date={event.date}
								room={event.room}
								description={event.description}
								image={event.image}
								onSelect={() => selectEvent(event, true)}
							/>
						</Stagger>
					))}
				</div>
			)}
		</div>
	);
}

function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

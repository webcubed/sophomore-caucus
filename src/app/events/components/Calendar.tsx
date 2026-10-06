"use client";

import type { MacchiatoColor } from "@/lib/macchiato";
import { calendarDays, dateKey } from "@/lib/school-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import CalendarDayCell from "./CalendarDayCell";
import CalendarDayDetail from "./CalendarDayDetail";
import CalendarLegend from "./CalendarLegend";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

interface CalendarProps {
	events: { color: MacchiatoColor; date: string }[];
	cursor: Date;
	dir: 1 | -1;
	dayDir: 1 | -1;
	onCursorChange: (cursor: Date) => void;
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
}

export default function Calendar({
	events,
	cursor,
	dir,
	dayDir,
	onCursorChange,
	selectedDate,
	onSelectDate,
}: CalendarProps) {
	const year = cursor.getFullYear();
	const month = cursor.getMonth();
	const today = new Date();

	const grid: (number | null)[] = [];
	const firstWeekday = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	for (let i = 0; i < firstWeekday; i++) grid.push(null);
	for (let day = 1; day <= daysInMonth; day++) grid.push(day);

	const eventDays = new Map(
		events
			.filter((e) => {
				const d = new Date(e.date);
				return d.getFullYear() === year && d.getMonth() === month;
			})
			.map((e) => [new Date(e.date).getDate(), e.color])
	);

	const slide = {
		initial: { opacity: 0, x: dir === 1 ? 16 : -16, filter: "blur(4px)" },
		animate: { opacity: 1, x: 0, filter: "blur(0px)" },
		transition: { duration: 0.15, ease: "easeOut" as const },
	};

	return (
		<MotionConfig reducedMotion="user">
			<div className="rounded-2xl border border-overlay0/70 bg-surface0/60 p-4 backdrop-blur-sm">
				<div className="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-2">
					<button
						type="button"
						onClick={() => {
							onCursorChange(
								new Date(today.getFullYear(), today.getMonth(), 1)
							);
							onSelectDate(today);
						}}
						className="cursor-pointer rounded-sm border border-overlay0/30 bg-surface1/60 px-2.5 py-1.5 text-xs font-medium text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95"
					>
						Today
					</button>
					<motion.span
						key={`${year}-${month}`}
						initial={slide.initial}
						animate={slide.animate}
						transition={slide.transition}
						className="text-center font-semibold text-text"
					>
						{monthNames[month]} {year}
					</motion.span>
					<div className="flex gap-2">
						<button
							type="button"
							aria-label="Previous month"
							onClick={() => onCursorChange(new Date(year, month - 1, 1))}
							className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-overlay0/30 bg-surface1/60 text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							aria-label="Next month"
							onClick={() => onCursorChange(new Date(year, month + 1, 1))}
							className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-overlay0/30 bg-surface1/60 text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>

				<motion.div
					key={`${year}-${month}`}
					initial={slide.initial}
					animate={slide.animate}
					transition={slide.transition}
				>
					<div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-subtext1">
						{weekdayNames.map((day) => (
							<div key={day}>{day}</div>
						))}
					</div>

					<div className="mt-1 grid grid-cols-7 gap-2">
						{grid.map((day, index) => {
							if (day === null) {
								return <div key={index} className="aspect-4/3" />;
							}
							const date = new Date(year, month, day);
							return (
								<CalendarDayCell
									key={index}
									date={date}
									entry={calendarDays.get(dateKey(year, month, day))}
									eventColor={eventDays.get(day)}
									isToday={sameDay(date, today)}
									isSelected={sameDay(date, selectedDate)}
									onSelectDate={onSelectDate}
								/>
							);
						})}
					</div>
				</motion.div>

				{/* Selected-day details (click a day above; no modal needed) */}
				<CalendarDayDetail date={selectedDate} dayDir={dayDir} />

				<CalendarLegend />
			</div>
		</MotionConfig>
	);
}

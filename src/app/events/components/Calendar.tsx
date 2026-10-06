"use client";

import type { MacchiatoColor } from "@/lib/macchiato";
import calendarData from "@/data/calendar.json";
import { MACCHIATO } from "@/lib/macchiato";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { useState } from "react";

type CalendarDay = {
	date: string;
	sourceWording: string;
	block: string | null;
	category: string;
};

const calendarDays = new Map<string, CalendarDay>(
	(calendarData as { days: CalendarDay[] }).days.map((d) => [d.date, d])
);

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

// Non-instructional / notable categories get a dot under the day number
function categoryDot(category: string): string | null {
	switch (category) {
		case "holiday":
		case "no_students":
		case "recess":
		case "professional_development":
			return "bg-red";
		case "regents":
		case "exam_day":
		case "parent_teacher":
		case "rating_day":
			return "bg-yellow";
		case "special_schedule":
			return "bg-sapphire";
		case "last_day":
			return "bg-green";
		default:
			return null;
	}
}

function blockColor(block: string): string {
	if (block.startsWith("A")) return "text-red";
	if (block.startsWith("B")) return "text-blue";
	return "text-subtext0";
}

function dateKey(year: number, month: number, day: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

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
	onCursorChange: (cursor: Date) => void;
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
}

export default function Calendar({
	events,
	cursor,
	dir,
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
								return <div key={index} className="aspect-[4/3]" />;
							}
							const date = new Date(year, month, day);
							const entry = calendarDays.get(dateKey(year, month, day));
							const eventColor = eventDays.get(day);
							const isToday = sameDay(date, today);
							const isSelected = sameDay(date, selectedDate);
							const dot = entry ? categoryDot(entry.category) : null;
							const block = entry?.block ?? null;
							const hasIndicator = dot !== null || block !== null;
							const state =
								eventColor !== undefined
									? "text-black font-medium hover:opacity-85"
									: isSelected
										? "bg-surface1 text-text hover:bg-surface1/70"
										: "text-text hover:bg-surface1/60";
							return (
								<button
									key={index}
									type="button"
									aria-label={`${monthNames[month]} ${day}, ${year}`}
									title={dot !== null ? entry?.sourceWording : undefined}
									onClick={() => onSelectDate(date)}
									style={
										eventColor !== undefined
											? { backgroundColor: MACCHIATO[eventColor] }
											: undefined
									}
									className={`flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors duration-150 ${state}${
										isToday ? " ring-2 ring-inset ring-accent" : ""
									}`}
								>
									<span>{day}</span>
									{hasIndicator && (
										<span className="flex h-2.5 items-center gap-1">
											{dot !== null && (
												<span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
											)}
											{block && (
												<span
													className={`text-[9px] font-semibold leading-none ${
														eventColor !== undefined ? "" : blockColor(block)
													}`}
												>
													{block}
												</span>
											)}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</motion.div>

				<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-overlay0/50 pt-3 text-[11px] text-subtext0">
					<span className="flex items-center gap-1">
						<span className="font-semibold text-red">A</span>
						<span className="font-semibold text-blue">B</span>
						<span>block days</span>
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-red"></span>
						No school
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-yellow"></span>
						Exams / regents
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-sapphire"></span>
						Special schedule
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-green"></span>
						Last day
					</span>
				</div>
			</div>
		</MotionConfig>
	);
}

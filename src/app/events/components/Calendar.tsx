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
	scheduleType: string | null;
};

type BellSchedules = Record<
	string,
	{
		periods: string[][];
		additionalEvents?: { summary: string; start: string; end: string }[];
	}
>;

const data = calendarData as {
	days: CalendarDay[];
	bellSchedules: BellSchedules;
};

const calendarDays = new Map<string, CalendarDay>(
	data.days.map((d) => [d.date, d])
);
const { bellSchedules } = data;

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

const categoryLabels: Record<string, string> = {
	school_day: "School day",
	holiday: "Holiday",
	recess: "Recess",
	regents: "Regents exams",
	no_students: "No students",
	special_schedule: "Special schedule",
	parent_teacher: "Parent-teacher conferences",
	rating_day: "Rating day",
	last_day: "Last day",
	exam_day: "Exam day",
	professional_development: "Professional development",
};

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

	const selectedKey = dateKey(
		selectedDate.getFullYear(),
		selectedDate.getMonth(),
		selectedDate.getDate()
	);
	const selectedDay = calendarDays.get(selectedKey) ?? null;
	const selectedLabel = selectedDate.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	// Bell schedule for the selected day — extra events merged in and
	// time-sorted, same as the home page CalendarBanner.
	type ScheduleRow = {
		label: string;
		start: string;
		end: string;
		summary?: string;
	};
	const bell = selectedDay?.scheduleType
		? bellSchedules[selectedDay.scheduleType]
		: undefined;
	const scheduleRows: ScheduleRow[] | null = bell
		? [
				...bell.periods.map(([start, end], i) => ({
					label: String(i + 1),
					start,
					end,
				})),
				...(bell.additionalEvents ?? []).map((e) => ({
					label: "HR",
					start: e.start,
					end: e.end,
					summary: e.summary,
				})),
			].sort((a, b) => a.start.localeCompare(b.start))
		: null;

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
									aria-current={isSelected ? "date" : undefined}
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

				{/* Selected-day details (click a day above; no modal needed) */}
				<div aria-live="polite">
					<motion.div
						key={selectedKey}
						initial={slide.initial}
						animate={slide.animate}
						transition={slide.transition}
						className="mt-4 rounded-lg border border-overlay0/50 bg-surface1/40 p-3"
					>
						<div className="flex items-center gap-2.5">
							<span
								className={`shrink-0 text-lg leading-none font-bold ${
									selectedDay?.block
										? blockColor(selectedDay.block)
										: "text-subtext0"
								}`}
							>
								{selectedDay?.block ?? "—"}
							</span>
							<div className="min-w-0">
								<p className="text-sm font-semibold text-text">
									{selectedLabel}
								</p>
								<p className="text-[11px] text-subtext0">
									{selectedDay
										? (categoryLabels[selectedDay.category] ??
											selectedDay.category)
										: "Outside calendar range"}
									{selectedDay?.scheduleType &&
										` · ${selectedDay.scheduleType} schedule`}
								</p>
							</div>
						</div>
						{selectedDay ? (
							<p className="mt-2 text-xs text-subtext1">
								{selectedDay.sourceWording}
							</p>
						) : (
							<p className="mt-2 text-xs text-subtext0">
								No schedule data for this day.
							</p>
						)}
						{scheduleRows && selectedDay?.scheduleType && (
							<div className="mt-3 overflow-hidden rounded-md border border-overlay0/40">
								<div className="flex items-baseline justify-between border-b border-overlay0/40 bg-surface1/50 px-2.5 py-1">
									<span className="text-[10px] font-semibold tracking-wider text-subtext1 uppercase">
										Bell schedule
									</span>
									<span className="text-[10px] text-subtext0">
										{selectedDay.scheduleType}
									</span>
								</div>
								<div className="flex">
									{[
										scheduleRows.slice(0, Math.ceil(scheduleRows.length / 2)),
										scheduleRows.slice(Math.ceil(scheduleRows.length / 2)),
									].map((column, ci) => (
										<div key={ci} className="flex min-w-0 flex-1 flex-col">
											{column.map((row) => (
												<div
													key={`${row.label}-${row.start}`}
													className="flex items-center gap-2 border-b border-overlay0/20 px-2.5 py-1 text-xs tabular-nums last:border-b-0"
												>
													<span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-surface1 px-1 text-[10px] font-semibold text-subtext0">
														{row.label}
													</span>
													<span className="text-subtext0">
														{row.start}
														<span className="mx-0.5 text-overlay1">–</span>
														{row.end}
													</span>
													{row.summary && (
														<span className="text-[10px] text-mauve">
															{row.summary}
														</span>
													)}
												</div>
											))}
										</div>
									))}
								</div>
							</div>
						)}
					</motion.div>
				</div>

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

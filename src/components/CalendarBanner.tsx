"use client";

import calendarData from "@/data/calendar.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type CalendarDay = {
	date: string;
	sourceWording: string;
	block: string | undefined;
	blockFamily: string | undefined;
	category: string;
	scheduleType: string | undefined;
	hasInstructionalPeriods: boolean;
	sourcePage: number;
};

const data = calendarData as {
	days: CalendarDay[];
	bellSchedules: Record<
		string,
		{
			periods: string[][];
			additionalEvents?: { summary: string; start: string; end: string }[];
		}
	>;
};
const { days } = data;

const TZ = "America/New_York";
const minDate = days[0].date;
const maxDate = days[days.length - 1].date;

// en-CA formats as YYYY-MM-DD; anchored to NY so everyone sees the school's date
function todayString(): string {
	return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

function nowHourMinute(): string {
	return new Date().toLocaleTimeString("en-GB", {
		timeZone: TZ,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
}

function addDays(dateString: string, delta: number): string {
	const d = new Date(dateString + "T12:00:00Z");
	d.setUTCDate(d.getUTCDate() + delta);
	return d.toISOString().slice(0, 10);
}

function findDay(dateString: string) {
	return days.find((d) => d.date === dateString);
}

function formatDate(dateString: string) {
	const d = new Date(dateString + "T00:00:00");
	return d.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default function CalendarBanner() {
	const [selected, setSelected] = useState<string>(() => todayString());
	const [now, setNow] = useState<string | null>(null);

	useEffect(() => {
		const tick = () => setNow(nowHourMinute());
		tick();
		const id = setInterval(tick, 60_000);
		return () => clearInterval(id);
	}, []);

	const today = todayString();
	const isToday = selected === today;
	const entry = findDay(selected);
	const selectedFormatted = formatDate(selected);

	const weekday = new Date(selected + "T00:00:00").toLocaleDateString("en-US", {
		weekday: "long",
	});

	const displayBlock = entry?.block ?? null;
	const scheduleType = entry?.scheduleType ?? null;
	const category = entry?.category ?? null;

	function blockColor(block: string | undefined) {
		if (!block) return "text-subtext0";
		if (block.startsWith("A")) return "text-red";
		if (block.startsWith("B")) return "text-blue";
		return "text-subtext0";
	}

	const schedulePeriods = scheduleType
		? (data.bellSchedules[scheduleType]?.periods ?? null)
		: null;

	// Merge extra events (e.g. the HR block on Administrative Distribution days)
	// into the period list, ordered by start time.
	type ScheduleRow = {
		label: string;
		start: string;
		end: string;
		special: boolean;
		summary?: string;
	};
	const scheduleRows: ScheduleRow[] | null =
		schedulePeriods && scheduleType
			? [
					...schedulePeriods.map(([start, end], i) => ({
						label: String(i + 1),
						start,
						end,
						special: false,
					})),
					...(data.bellSchedules[scheduleType].additionalEvents ?? []).map(
						(e) => ({
							label: "HR",
							start: e.start,
							end: e.end,
							special: true,
							summary: e.summary,
						})
					),
				].sort((a, b) => a.start.localeCompare(b.start))
			: null;

	const isHoliday = category === "holiday";
	const isBreak = category === "school_break" || category === "break";
	const isTesting = category === "testing";
	const isSpecial =
		entry &&
		(entry.category === "special_schedule" ||
			(entry.scheduleType !== null && entry.scheduleType !== "Regular"));
	const showChips = isHoliday || isBreak || isTesting || isSpecial;

	function go(delta: number) {
		setSelected((d) => {
			const next = addDays(d, delta);
			return next < minDate || next > maxDate ? d : next;
		});
	}

	const withinRange = selected >= minDate && selected <= maxDate;

	return (
		<section className="w-full rounded-xl border border-overlay0/30 bg-surface0 px-5 py-4 sm:px-6 sm:py-4">
			<div className="relative pr-32">
				<h1 className="font-extrabold text-text sm:text-3xl">
					{selectedFormatted}
				</h1>

				<div className="absolute top-0 right-0 flex items-center gap-1.5">
					{!isToday && (
						<button
							type="button"
							onClick={() => setSelected(todayString())}
							className="cursor-pointer rounded-md border border-overlay0/50 bg-surface1/60 px-2 py-1 text-[11px] font-medium text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95"
						>
							Today
						</button>
					)}
					<button
						type="button"
						aria-label="Previous day"
						title="Previous day"
						onClick={() => go(-1)}
						disabled={selected <= minDate}
						className="cursor-pointer rounded-md border border-overlay0/50 bg-surface1/60 p-1 text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-overlay0/50 disabled:hover:bg-surface1/60 disabled:hover:text-subtext1"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						type="button"
						aria-label="Next day"
						title="Next day"
						onClick={() => go(1)}
						disabled={selected >= maxDate}
						className="cursor-pointer rounded-md border border-overlay0/50 bg-surface1/60 p-1 text-subtext1 transition-colors duration-150 hover:border-overlay1 hover:bg-surface1 hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-overlay0/50 disabled:hover:bg-surface1/60 disabled:hover:text-subtext1"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-4">
				{displayBlock !== null ? (
					<div
						className={`shrink-0 text-8xl ${blockColor(displayBlock)}`}
						style={{
							fontFamily: "'Google Sans Flex', sans-serif",
							fontVariationSettings: '"ROND" 100, "wght" 700',
						}}
					>
						{displayBlock}
					</div>
				) : (
					<div className="shrink-0 text-subtext0">--</div>
				)}

				<div className="min-w-0">
					<p className="text-subtext0">
						{weekday}
						{isToday && <span className="text-green"> · Today</span>}
					</p>

					{entry?.sourceWording !== undefined && (
						<p className="mt-2 text-subtext1">{entry.sourceWording}</p>
					)}
				</div>
			</div>

			{scheduleRows && (
				<div className="mt-3 overflow-hidden rounded-lg border border-overlay0/40">
					<div className="flex items-baseline justify-between border-b border-overlay0/40 bg-surface1/50 px-3 py-1.5">
						<span className="text-[10px] font-semibold uppercase tracking-wider text-subtext1">
							Bell Schedule
						</span>
						<span className="text-[10px] text-subtext0">{scheduleType}</span>
					</div>
					<div className="flex">
						{[
							scheduleRows.slice(0, Math.ceil(scheduleRows.length / 2)),
							scheduleRows.slice(Math.ceil(scheduleRows.length / 2)),
						].map((column, ci) => (
							<div key={ci} className="flex min-w-0 flex-1 flex-col">
								{column.map((row) => {
									const active =
										isToday &&
										now !== null &&
										now >= row.start &&
										now < row.end;
									return (
										<div
											key={`${row.label}-${row.start}`}
											className={`flex items-center gap-2 border-b border-overlay0/20 px-2.5 py-1.5 text-xs tabular-nums last:border-b-0 ${
												active ? "bg-accent/10" : ""
											}`}
										>
											<span
												className={`flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
													active
														? "bg-accent text-base"
														: row.special
															? "bg-surface1 text-mauve"
															: "bg-surface1 text-subtext0"
												}`}
											>
												{row.label}
											</span>
											<span className={active ? "text-text" : "text-subtext0"}>
												{row.start}
												<span className="mx-0.5 text-overlay1">–</span>
												{row.end}
											</span>
											{row.special && row.summary && (
												<span className="text-[10px] text-mauve">
													{row.summary}
												</span>
											)}
											{active && (
												<span className="ml-auto text-[10px] font-semibold text-accent">
													Now
												</span>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			)}

			{scheduleType !== null && !schedulePeriods && (
				<p className="mt-2 text-xs text-subtext0">Schedule: {scheduleType}</p>
			)}

			{showChips && (
				<div className="mt-3 flex flex-wrap gap-2">
					{isHoliday && <span className="text-xs text-red">Holiday</span>}
					{isBreak && <span className="text-xs text-subtext0">Break</span>}
					{isTesting && <span className="text-xs text-yellow">Testing</span>}
					{isSpecial && (
						<span className="text-xs text-mauve">Special Schedule</span>
					)}
				</div>
			)}

			{!entry && (
				<p className="mt-2 text-xs text-subtext0">
					{withinRange ? "No school" : "Outside calendar range"}
				</p>
			)}
		</section>
	);
}

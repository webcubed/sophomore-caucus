"use client";

import {
	bellRows,
	bellSchedule,
	blockColor,
	calendarDays,
	maxDate,
	minDate,
} from "@/lib/school-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TZ = "America/New_York";

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
	const [dir, setDir] = useState<1 | -1>(1);
	const [bodyH, setBodyH] = useState<number | null>(null);

	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const tick = () => setNow(nowHourMinute());
		tick();
		const id = setInterval(tick, 60_000);
		return () => clearInterval(id);
	}, []);

	// Keep the card's height in sync with the day's content so it tweens.
	useEffect(() => {
		const el = innerRef.current;
		if (el) setBodyH(el.offsetHeight);
	}, [selected]);

	const today = todayString();
	const isToday = selected === today;
	const entry = calendarDays.get(selected);
	const selectedFormatted = formatDate(selected);

	const weekday = new Date(selected + "T00:00:00").toLocaleDateString("en-US", {
		weekday: "long",
	});

	const displayBlock = entry?.block ?? null;
	const scheduleType = entry?.scheduleType ?? null;
	const category = entry?.category ?? null;

	const schedulePeriods = bellSchedule(scheduleType)?.periods ?? null;
	const scheduleRows = bellRows(scheduleType);

	const isHoliday = category === "holiday";
	const isBreak = category === "school_break" || category === "break";
	const isTesting = category === "testing";
	const isSpecial =
		entry &&
		(entry.category === "special_schedule" ||
			(entry.scheduleType !== null && entry.scheduleType !== "Regular"));
	const showChips = isHoliday || isBreak || isTesting || isSpecial;

	function go(delta: 1 | -1) {
		const next = addDays(selected, delta);
		if (next < minDate || next > maxDate) return;
		setDir(delta);
		setSelected(next);
	}

	const withinRange = selected >= minDate && selected <= maxDate;

	return (
		<MotionConfig reducedMotion="user">
			<section className="w-full rounded-xl border border-overlay0/30 bg-surface0 px-5 py-4 sm:px-6 sm:py-4">
				<div className="relative pr-32">
					<h1 className="font-extrabold text-text sm:text-3xl">
						<motion.span
							key={selected}
							className="inline-block"
							initial={{
								opacity: 0,
								x: dir === 1 ? 16 : -16,
								filter: "blur(4px)",
							}}
							animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.15, ease: "easeOut" }}
						>
							{selectedFormatted}
						</motion.span>
					</h1>

					<div className="absolute top-0 right-0 flex items-center gap-1.5">
						{!isToday && (
							<button
								type="button"
								onClick={() => {
									const t = todayString();
									setDir(t > selected ? 1 : -1);
									setSelected(t);
								}}
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

				<motion.div
					animate={{ height: bodyH ?? "auto" }}
					transition={{ duration: 0.15, ease: "easeOut" }}
					className="mt-4 -mx-5 overflow-hidden px-5 sm:-mx-6 sm:px-6"
				>
					<motion.div
						ref={innerRef}
						key={selected}
						initial={{
							opacity: 0,
							x: dir === 1 ? 16 : -16,
							filter: "blur(4px)",
						}}
						animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<div className="flex items-center gap-4">
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
								<div className="shrink-0 text-8xl text-subtext0">--</div>
							)}

							<div className="min-w-0">
								<p className="text-subtext0">
									{weekday}
									{isToday && <span className="text-green"> · Today</span>}
								</p>

								{entry?.sourceWording !== undefined && (
									<p className="mt-2 text-subtext1">{entry.sourceWording}</p>
								)}

								{!entry && (
									<p className="mt-2 text-xs text-subtext0">
										{withinRange ? "No school" : "Outside calendar range"}
									</p>
								)}
							</div>
						</div>

						{scheduleRows && (
							<div className="mt-3 overflow-hidden rounded-lg border border-overlay0/40">
								<div className="flex items-baseline justify-between border-b border-overlay0/40 bg-surface1/50 px-3 py-1.5">
									<span className="text-[10px] font-semibold uppercase tracking-wider text-subtext1">
										Bell Schedule
									</span>
									<span className="text-[10px] text-subtext0">
										{scheduleType}
									</span>
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
														<span
															className={active ? "text-text" : "text-subtext0"}
														>
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
							<p className="mt-2 text-xs text-subtext0">
								Schedule: {scheduleType}
							</p>
						)}

						{showChips && (
							<div className="mt-3 flex flex-wrap gap-2">
								{isHoliday && <span className="text-xs text-red">Holiday</span>}
								{isBreak && (
									<span className="text-xs text-subtext0">Break</span>
								)}
								{isTesting && (
									<span className="text-xs text-yellow">Testing</span>
								)}
								{isSpecial && (
									<span className="text-xs text-mauve">Special Schedule</span>
								)}
							</div>
						)}
					</motion.div>
				</motion.div>
			</section>
		</MotionConfig>
	);
}

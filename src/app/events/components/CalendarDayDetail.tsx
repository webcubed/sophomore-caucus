import type { ScheduleRow } from "@/lib/school-calendar";
import {
	bellRows,
	blockColor,
	calendarDays,
	dateKey,
} from "@/lib/school-calendar";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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

function BellScheduleTable({
	scheduleType,
	rows,
}: {
	scheduleType: string;
	rows: ScheduleRow[];
}) {
	return (
		<div className="mt-3 overflow-hidden rounded-md border border-overlay0/40">
			<div className="flex items-baseline justify-between border-b border-overlay0/40 bg-surface1/50 px-2.5 py-1">
				<span className="text-[10px] font-semibold tracking-wider text-subtext1 uppercase">
					Bell schedule
				</span>
				<span className="text-[10px] text-subtext0">{scheduleType}</span>
			</div>
			<div className="flex">
				{[
					rows.slice(0, Math.ceil(rows.length / 2)),
					rows.slice(Math.ceil(rows.length / 2)),
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
									<span className="text-[10px] text-mauve">{row.summary}</span>
								)}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default function CalendarDayDetail({
	date,
	dayDir,
}: {
	date: Date;
	dayDir: 1 | -1;
}) {
	const [detailsOpen, setDetailsOpen] = useState(false);

	const selectedKey = dateKey(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);
	const selectedDay = calendarDays.get(selectedKey) ?? null;
	const selectedLabel = date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const scheduleRows = selectedDay ? bellRows(selectedDay.scheduleType) : null;

	return (
		<div aria-live="polite">
			<motion.div
				key={selectedKey}
				initial={{
					opacity: 0,
					x: dayDir === 1 ? 16 : -16,
					filter: "blur(4px)",
				}}
				animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
				transition={{ duration: 0.15, ease: "easeOut" }}
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
						{selectedDay?.block ?? "--"}
					</span>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold text-text">{selectedLabel}</p>
						<p className="text-[11px] text-subtext0">
							{selectedDay
								? (categoryLabels[selectedDay.category] ?? selectedDay.category)
								: "Outside calendar range"}
							{selectedDay?.scheduleType &&
								` · ${selectedDay.scheduleType} schedule`}
						</p>
					</div>
					<button
						type="button"
						className="-my-1 -mr-1 cursor-pointer rounded-sm p-1.5 text-subtext1 transition-colors duration-150 hover:text-text active:scale-95 sm:hidden"
						aria-expanded={detailsOpen}
						aria-controls="day-details"
						aria-label={detailsOpen ? "Hide day details" : "Show day details"}
						onClick={() => setDetailsOpen((open) => !open)}
					>
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-150 ${
								detailsOpen ? "rotate-180" : ""
							}`}
						/>
					</button>
				</div>
				{/* Mobile starts collapsed to keep the calendar compact;
				    desktop always shows (sm:block) */}
				<div
					id="day-details"
					className={detailsOpen ? undefined : "hidden sm:block"}
				>
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
						<BellScheduleTable
							scheduleType={selectedDay.scheduleType}
							rows={scheduleRows}
						/>
					)}
				</div>
			</motion.div>
		</div>
	);
}

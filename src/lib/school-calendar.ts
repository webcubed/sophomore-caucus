// Shared access to the school calendar data — one source for the home page
// CalendarBanner and the events page calendar. UI stays in each widget;
// only data shape and derived logic live here.

import calendarData from "@/data/calendar.json";

export type CalendarDay = {
	date: string;
	sourceWording: string;
	block: string | null;
	category: string;
	scheduleType: string | null;
};

export type BellSchedules = Record<
	string,
	{
		periods: string[][];
		additionalEvents?: { summary: string; start: string; end: string }[];
	}
>;

export type ScheduleRow = {
	label: string;
	start: string;
	end: string;
	special?: boolean;
	summary?: string;
};

const data = calendarData as {
	days: CalendarDay[];
	bellSchedules: BellSchedules;
};

export const calendarDays = new Map<string, CalendarDay>(
	data.days.map((d) => [d.date, d])
);
export const minDate = data.days[0].date;
export const maxDate = data.days[data.days.length - 1].date;

export function dateKey(year: number, month: number, day: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function blockColor(block: string | null | undefined): string {
	if (block?.startsWith("A")) return "text-red";
	if (block?.startsWith("B")) return "text-blue";
	return "text-subtext0";
}

export function bellSchedule(scheduleType: string | null | undefined) {
	return scheduleType ? (data.bellSchedules[scheduleType] ?? null) : null;
}

// Bell-schedule rows for a schedule type — extra events (HR etc.) merged
// in and time-sorted. Shared by the home banner and the events calendar.
export function bellRows(
	scheduleType: string | null | undefined
): ScheduleRow[] | null {
	const bell = bellSchedule(scheduleType);
	if (!bell) return null;
	return [
		...bell.periods.map(([start, end], i) => ({
			label: String(i + 1),
			start,
			end,
		})),
		...(bell.additionalEvents ?? []).map((e) => ({
			label: "HR",
			start: e.start,
			end: e.end,
			special: true,
			summary: e.summary,
		})),
	].sort((a, b) => a.start.localeCompare(b.start));
}

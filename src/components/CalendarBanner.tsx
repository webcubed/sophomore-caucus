import calendarData from "@/data/calendar.json";

interface CalendarDay {
	date: string;
	day: string;
	weekday: string;
	block: string | null;
	blockFamily: string | null;
	testing: boolean;
	events: string[];
	sourceText: string;
	flags: {
		isTesting: boolean;
		isNoStudents: boolean;
		isRecess: boolean;
		isSpecialSchedule: boolean;
		isHoliday: boolean;
	};
}

const days: CalendarDay[] = calendarData.days as CalendarDay[];

function todayString(): string {
	return new Date().toISOString().split("T")[0];
}

function findDay(dateString: string) {
	return days.find((d) => d.date === dateString);
}

function formatDate(dateString: string) {
	const d = new Date(dateString + "T00:00:00");
	return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function CalendarBanner() {
	const today = todayString();
	const entry = findDay(today);
	const todayFormatted = formatDate(today);

	const weekday = entry
		? entry.weekday
		: new Date(today + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });

	const displayBlock = entry?.block ?? null;
	const events = entry?.events ?? [];
	const flags = entry?.flags ?? {
		isTesting: false,
		isNoStudents: false,
		isRecess: false,
		isSpecialSchedule: false,
		isHoliday: false,
	};
	const isInRange = !!entry;

	function blockColor(b: string | null) {
		if (!b) return "text-subtext0";
		if (b.startsWith("A")) return "text-red";
		if (b.startsWith("B")) return "text-green";
		return "text-subtext0";
	}

	return (
		<section className="w-full rounded-xl border border-overlay0/30 bg-surface0 px-5 py-5 sm:px-6 sm:py-5">
			<div className="flex flex-row items-baseline justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-text">{todayFormatted}</h1>
					<p className="text-subtext0">{weekday}</p>
				</div>

				{displayBlock ? (
					<div className="text-right">
						<h1 className={`${blockColor(displayBlock)}`}>
							{displayBlock} day
						</h1>
					</div>
				) : (
					<div className="text-right">
						<span className="text-4xl font-black text-subtext0">--</span>
						<p className="text-xs text-subtext0 mt-0.5">No School</p>
					</div>
				)}
			</div>

			{(events.length > 0 || entry?.sourceText) && (
				<div className="mt-3 border-t border-overlay0/20 pt-3">
					{events.map((ev, i) => (
						<p key={i} className="text-sm text-subtext1">{ev}</p>
					))}
					{!events.length && entry?.sourceText && (
						<p className="text-sm text-subtext1">{entry.sourceText}</p>
					)}
				</div>
			)}

			{!isInRange && (
				<p className="mt-2 text-xs text-subtext0">no info</p>
			)}

			{(flags.isHoliday || flags.isTesting || flags.isSpecialSchedule || flags.isNoStudents) && (
				<div className="mt-2 flex flex-wrap gap-2">
					{flags.isHoliday && <span className="text-xs text-red">Holiday</span>}
					{flags.isTesting && <span className="text-xs text-yellow">Testing</span>}
					{flags.isSpecialSchedule && <span className="text-xs text-mauve">Special Schedule</span>}
					{flags.isNoStudents && <span className="text-xs text-subtext0">No Students</span>}
				</div>
			)}
		</section>
	);
}

import calendarData from "@/data/calendar.json";

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
	bellSchedules: Record<string, { periods: string[][] }>;
};
const { days } = data;

function todayString(): string {
	return new Date().toISOString().split("T", 1)[0];
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
	const todayString_ = todayString();
	const entry = findDay(todayString_);
	const todayFormatted = formatDate(todayString_);

	const weekday = entry
		? new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
				weekday: "long",
			})
		: new Date(todayString_ + "T00:00:00").toLocaleDateString("en-US", {
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

	const isHoliday = category === "holiday";
	const isBreak = category === "school_break" || category === "break";
	const isTesting = category === "testing";
	const isSpecial =
		entry &&
		(entry.category === "special_schedule" ||
			(entry.scheduleType !== null && entry.scheduleType !== "Regular"));

	return (
		<section className="w-full rounded-xl border border-overlay0/30 bg-surface0 px-5 py-4 sm:px-6 sm:py-4">
			<div className="flex flex-row items-center gap-6">
				<div className="flex items-center justify-center">
					{(displayBlock !== null) ? (
						<h1
							className={`text-8xl ${blockColor(displayBlock)}`}
							style={{ fontFamily: "'Google Sans'" }}
						>
							{displayBlock}
						</h1>
					) : (
						<h1 className="text-subtext0">--</h1>
					)}
				</div>

				<div className="flex min-w-0 flex-1 flex-col justify-center border-l border-overlay0/20 pl-6">
					<h1 className="font-extrabold text-text sm:text-3xl">
						{todayFormatted}
					</h1>
					<p className="text-subtext0">{weekday}</p>

					{entry?.sourceWording !== undefined && (
						<p className="mt-2 text-subtext1">{entry.sourceWording}</p>
					)}

					{schedulePeriods && (
						<div className="mt-2 flex flex-col gap-0.5 text-[10px] text-subtext1 tabular-nums leading-tight">
							{schedulePeriods.map(([start, end], i) => (
								<div key={i} className="flex items-baseline gap-2">
									<span className="w-3 shrink-0 text-right font-semibold text-text">
										{i + 1}
									</span>
									<span className="text-subtext0">{start}</span>
									<span className="text-subtext0 mx-0.5">-</span>
									<span className="text-subtext0">{end}</span>
								</div>
							))}
						</div>
					)}

					{scheduleType !== null && !schedulePeriods && (
						<p className="mt-2 text-xs text-subtext0">
							Schedule: {scheduleType}
						</p>
					)}

					{((isHoliday || isTesting || isSpecial) ?? isBreak) && (
						<div className="mt-3 flex flex-wrap gap-2">
							{isHoliday && <span className="text-xs text-red">Holiday</span>}
							{isBreak && <span className="text-xs text-subtext0">Break</span>}
							{isTesting && (
								<span className="text-xs text-yellow">Testing</span>
							)}
							{isSpecial && (
								<span className="text-xs text-mauve">Special Schedule</span>
							)}
						</div>
					)}

					{!entry && (
						<p className="mt-2 text-xs text-subtext0">Outside calendar range</p>
					)}
				</div>
			</div>
		</section>
	);
}

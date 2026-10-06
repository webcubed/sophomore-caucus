import type { MacchiatoColor } from "@/lib/macchiato";
import type { CalendarDay } from "@/lib/school-calendar";
import { MACCHIATO } from "@/lib/macchiato";
import { blockColor } from "@/lib/school-calendar";

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

type CalendarDayCellProps = {
	date: Date;
	entry?: CalendarDay;
	eventColor?: MacchiatoColor;
	isToday: boolean;
	isSelected: boolean;
	onSelectDate: (date: Date) => void;
};

export default function CalendarDayCell({
	date,
	entry,
	eventColor,
	isToday,
	isSelected,
	onSelectDate,
}: CalendarDayCellProps) {
	const dot = entry ? categoryDot(entry.category) : null;
	const block = entry?.block ?? null;
	const hasIndicator = dot !== null || block !== null;
	const state =
		eventColor !== undefined
			? "text-black font-medium hover:opacity-85"
			: isSelected
				? "bg-surface1 text-text hover:bg-surface1/70"
				: "text-text hover:bg-surface1/60";
	const label = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	return (
		<button
			type="button"
			aria-label={label}
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
			<span>{date.getDate()}</span>
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
}

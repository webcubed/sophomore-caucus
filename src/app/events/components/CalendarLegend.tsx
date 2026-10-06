export default function CalendarLegend() {
	return (
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
	);
}

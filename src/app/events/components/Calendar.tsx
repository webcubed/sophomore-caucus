"use client";

export default function Calendar() {
	return (
		<div className="w-full aspect-square rounded-lg border border-overlay1/40 bg-surface0/60 text-text transition-colors hover:bg-surface0/80">
			<iframe
				src="https://calendar.google.com/calendar/embed?height=600"
				className="w-full h-full rounded-lg"
				loading="lazy"
				title="Sophomore Caucus Calendar"
			></iframe>
		</div>
	);
}

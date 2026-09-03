"use client";

import Calendar from "./components/Calendar";

export default function Events() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
			<div className="text-center">
				<h1>Events</h1>
				<p className="mt-3 sm:mt-4">Check out our upcoming events!</p>
			</div>
			<section className="mt-8 sm:mt-12 w-full max-w-5xl">
				<Calendar />
			</section>
		</main>
	);
}

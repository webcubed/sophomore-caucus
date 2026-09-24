"use client";
import { useState } from "react";

interface CalendarProps {
	events: {
		colorNum: number; eventName: string; 
		date: string; room?: number | null; 
		description: string; image?: string | null
	}[]
}
const colors = [
        'bg-blue', 'bg-mauve', 
        'bg-sapphire', 'bg-peach', 
        'bg-green', 'bg-yellow', 
        'bg-lavender', 'bg-teal', 
        'bg-red'];

export default function Calendar({ events }: CalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date()) // current date displayed in the calendar, new Date() initializes it to the current date
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	function goToPrevMonth() {
  		setCurrentDate(new Date(year, month - 1, 1))
	}

	function goToNextMonth() {
  		setCurrentDate(new Date(year, month + 1, 1))
	}

	function getMonthGrid(year: number, month: number) {
  		const firstWeekday = new Date(year, month, 1).getDay()
  		const daysInMonth = new Date(year, month + 1, 0).getDate()
  
 		const grid = []

		for (let i = 0; i < firstWeekday; i++) {
			grid.push(null)
  		}
		for (let day = 1; day <= daysInMonth; day++) {
			grid.push(day)
  		}

  		return grid
	}	

	const grid = getMonthGrid(year, month)

	const dayColorMap = new Map(
  		events
    	.filter((e) => {
      	const d = new Date(e.date);
      	return d.getFullYear() === year && d.getMonth() === month;
    	})
    	.map((e) => [new Date(e.date).getDate(), e.colorNum])
	);

	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	return (
  	<div>
    	<div className="flex justify-between items-center mb-4">
      		<button onClick={goToPrevMonth} className="px-3 py-2">{"<"}</button>
      		<span>{monthNames[month]} {year}</span>
      		<button onClick={goToNextMonth} className="px-3 py-2">{">"}</button>
    	</div>

    	<div className="grid grid-cols-7 text-center font-semibold">
      		{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
      			<div key={day}>{day}</div>
      		))}
    	</div>

    	<div className="grid grid-cols-7 text-center gap-1">
    	  	{grid.map((day, index) => (
				<div key={index} className={`p-2 ${day && dayColorMap.has(day) ? "rounded-full text-black " + colors[dayColorMap.get(day)! % 9] : ""}`}>
		  			{day}
				</div>
		  	))}
		</div>
  	</div>
	);
}
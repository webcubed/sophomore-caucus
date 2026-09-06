import type { LucideIcon } from "lucide-react";
import {
	CalendarClock,
	Megaphone,
	MessagesSquare,
	ShelvingUnit,
	Toolbox,
} from "lucide-react";

export type NavHighlight = "accent" | "green" | "peach" | "sapphire" | "yellow";

export const pages: Array<{
	href: string;
	label: string;
	icon: LucideIcon;
	highlightColor: NavHighlight;
}> = [
	{
		href: "/announcements",
		label: "Announcements",
		icon: Megaphone,
		highlightColor: "peach",
	},
	{
		href: "/contact",
		label: "Contact",
		icon: MessagesSquare,
		highlightColor: "green",
	},
	{
		href: "/cabinet",
		label: "Cabinet",
		icon: ShelvingUnit,
		highlightColor: "sapphire",
	},
	{
		href: "/resources",
		label: "Resources",
		icon: Toolbox,
		highlightColor: "yellow",
	},
	{
		href: "/events",
		label: "Events",
		icon: CalendarClock,
		highlightColor: "accent",
	},
];

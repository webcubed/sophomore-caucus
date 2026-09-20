import type { NavHighlight } from "@/lib/constants";

export type HighlightStyles = {
	active: string;
	mobileActive: string;
	hover: string;
};

export const highlightStyles: Record<NavHighlight, HighlightStyles> = {
	accent: {
		active: "text-accent bg-accent/15",
		mobileActive: "text-accent bg-accent/15 backdrop-blur-md border border-accent/20 ring-1 ring-accent/20",
		hover: "hover:bg-accent/10 hover:ring-1 hover:ring-accent/20",
	},
	green: {
		active: "text-green bg-green/15",
		mobileActive: "text-green bg-green/15 backdrop-blur-md border border-green/20 ring-1 ring-green/20",
		hover: "hover:bg-green/10 hover:ring-1 hover:ring-green/20",
	},
	peach: {
		active: "text-peach bg-peach/15",
		mobileActive: "text-peach bg-peach/15 backdrop-blur-md border border-peach/20 ring-1 ring-peach/20",
		hover: "hover:bg-peach/10 hover:ring-1 hover:ring-peach/20",
	},
	sapphire: {
		active: "text-sapphire bg-sapphire/15",
		mobileActive: "text-sapphire bg-sapphire/15 backdrop-blur-md border border-sapphire/20 ring-1 ring-sapphire/20",
		hover: "hover:bg-sapphire/10 hover:ring-1 hover:ring-sapphire/20",
	},
	yellow: {
		active: "text-yellow bg-yellow/15",
		mobileActive: "text-yellow bg-yellow/15 backdrop-blur-md border border-yellow/20 ring-1 ring-yellow/20",
		hover: "hover:bg-yellow/10 hover:ring-1 hover:ring-yellow/20",
	},
};

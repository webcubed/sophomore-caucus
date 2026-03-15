import type { LucideIcon } from "lucide-react";
import {
	BadgeDollarSign,
	Briefcase,
	CalendarDays,
	CloudCog,
	Megaphone,
	Palette,
	Shield,
	Users,
} from "lucide-react";

export const roleMeta = {
	"caucus-president": {
		label: "Caucus President",
		icon: Shield,
	},
	"chief-of-staff": {
		label: "Chief of Staff",
		icon: Briefcase,
	},
	"it-director": {
		label: "IT Director",
		icon: CloudCog,
	},
	"media-graphics-director": {
		label: "Media & Graphics Director",
		icon: Palette,
	},
	"externals-outreach-director": {
		label: "Externals/Outreach Director",
		icon: Megaphone,
	},
	"finance-director": {
		label: "Finance Director",
		icon: BadgeDollarSign,
	},
	"events-director": {
		label: "Events Director",
		icon: CalendarDays,
	},
	"internals-director": {
		label: "Internals Director",
		icon: Users,
	},
} as const;

export const roleStyles: Record<
	keyof typeof roleMeta,
	{
		bg: string;
		text: string;
		hoverBg: string;
		hoverText: string;
		border: string;
	}
> = {
	"caucus-president": {
		bg: "bg-ctp-sapphire/20",
		text: "text-ctp-sapphire",
		hoverBg: "hover:bg-ctp-sapphire/20",
		hoverText: "hover:text-ctp-sapphire",
		border: "border-ctp-sapphire",
	},
	"chief-of-staff": {
		bg: "bg-ctp-lavender/20",
		text: "text-ctp-lavender",
		hoverBg: "hover:bg-ctp-lavender/20",
		hoverText: "hover:text-ctp-lavender",
		border: "border-ctp-lavender",
	},
	"it-director": {
		bg: "bg-ctp-blue/20",
		text: "text-ctp-blue",
		hoverBg: "hover:bg-ctp-blue/20",
		hoverText: "hover:text-ctp-blue",
		border: "border-ctp-blue",
	},
	"media-graphics-director": {
		bg: "bg-ctp-mauve/20",
		text: "text-ctp-mauve",
		hoverBg: "hover:bg-ctp-mauve/20",
		hoverText: "hover:text-ctp-mauve",
		border: "border-ctp-mauve",
	},
	"externals-outreach-director": {
		bg: "bg-ctp-green/20",
		text: "text-ctp-green",
		hoverBg: "hover:bg-ctp-green/20",
		hoverText: "hover:text-ctp-green",
		border: "border-ctp-green",
	},
	"finance-director": {
		bg: "bg-ctp-yellow/20",
		text: "text-ctp-yellow",
		hoverBg: "hover:bg-ctp-yellow/20",
		hoverText: "hover:text-ctp-yellow",
		border: "border-ctp-yellow",
	},
	"events-director": {
		bg: "bg-ctp-peach/20",
		text: "text-ctp-peach",
		hoverBg: "hover:bg-ctp-peach/20",
		hoverText: "hover:text-ctp-peach",
		border: "border-ctp-peach",
	},
	"internals-director": {
		bg: "bg-ctp-teal/20",
		text: "text-ctp-teal",
		hoverBg: "hover:bg-ctp-teal/20",
		hoverText: "hover:text-ctp-teal",
		border: "border-ctp-teal",
	},
};

export type Roles = keyof typeof roleMeta;

export type RoleMeta = {
	label: string;
	icon: LucideIcon;
};

export const memberLevelMeta = {
	director: {
		label: "Director",
	},
	"assistant-director": {
		label: "Assistant Director",
	},
	member: {
		label: "Member",
	},
} as const;

export type MemberLevel = keyof typeof memberLevelMeta;

export type MemberProfile = {
	name: string;
	description?: string;
	imagePath?: string;
};

export type RoleMembers = Partial<Record<MemberLevel, MemberProfile[]>> & {
	ungrouped?: MemberProfile[];
};

export const members: Record<Roles, RoleMembers> = {
	"caucus-president": {
		ungrouped: [{ name: "Julius Caesar" }, { name: "Cleopatra" }],
	},
	"chief-of-staff": {
		director: [{ name: "Marie Curie" }],
		"assistant-director": [{ name: "Aristotle" }],
		member: [{ name: "Amelia Earhart" }, { name: "Saladin" }],
	},
	"it-director": {
		director: [{ name: "Ada Lovelace" }],
		"assistant-director": [{ name: "Galileo Galilei" }],
		member: [
			{ name: "Frida Kahlo" },
			{ name: "Harriet Tubman" },
			{ name: "Marco Polo" },
		],
	},
	"media-graphics-director": {
		director: [{ name: "Napoleon Bonaparte" }],
		"assistant-director": [{ name: "Charles Darwin" }],
		member: [
			{ name: "Nikola Tesla" },
			{ name: "Abraham Lincoln" },
			{ name: "Ferdinand Magellan" },
		],
	},
	"externals-outreach-director": {
		director: [{ name: "Joan of Arc" }],
		"assistant-director": [{ name: "Genghis Khan" }],
		member: [
			{ name: "Ludwig van Beethoven" },
			{ name: "George Washington" },
			{ name: "Zheng He" },
		],
	},
	"finance-director": {
		director: [{ name: "Leonardo da Vinci" }],
		"assistant-director": [
			{
				name: "Sun Tzu",
				imagePath:
					"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ZcmBHOX_JBejsj1nKY8nkwHaIe%3Fpid%3DApi&f=1&ipt=eacc5c869d557f1f837b996b06658aa2a08e3c1b9f396921563f20437890717d&ipo=images",
			},
		],
		member: [
			{ name: "Wolfgang Amadeus Mozart" },
			{ name: "Queen Victoria" },
			{ name: "Akbar the Great" },
		],
	},
	"events-director": {
		director: [{ name: "Isaac Newton" }],
		"assistant-director": [{ name: "Socrates" }],
		member: [
			{ name: "Vincent van Gogh" },
			{ name: "Catherine the Great" },
			{ name: "Hammurabi" },
		],
	},
	"internals-director": {
		director: [{ name: "Albert Einstein" }],
		"assistant-director": [{ name: "Plato" }],
		member: [{ name: "William Shakespeare" }, { name: "Mansa Musa" }],
	},
};

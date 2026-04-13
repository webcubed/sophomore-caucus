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
	"media-graphics-director": {
		label: "Media & Graphics",
		icon: Palette,
	},
	"finance-director": {
		label: "Finance",
		icon: BadgeDollarSign,
	},
	"events-director": {
		label: "Events",
		icon: CalendarDays,
	},
	"internals-director": {
		label: "Internals",
		icon: Users,
	},
	"externals-outreach-director": {
		label: "Externals/Outreach",
		icon: Megaphone,
	},
	"it-director": {
		label: "I.T.",
		icon: CloudCog,
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
	"media-graphics-director": {
		bg: "bg-ctp-mauve/20",
		text: "text-ctp-mauve",
		hoverBg: "hover:bg-ctp-mauve/20",
		hoverText: "hover:text-ctp-mauve",
		border: "border-ctp-mauve",
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
	"externals-outreach-director": {
		bg: "bg-ctp-green/20",
		text: "text-ctp-green",
		hoverBg: "hover:bg-ctp-green/20",
		hoverText: "hover:text-ctp-green",
		border: "border-ctp-green",
	},
	"it-director": {
		bg: "bg-ctp-blue/20",
		text: "text-ctp-blue",
		hoverBg: "hover:bg-ctp-blue/20",
		hoverText: "hover:text-ctp-blue",
		border: "border-ctp-blue",
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
	image?: string;
};

export type RoleMembers = Partial<Record<MemberLevel, MemberProfile[]>> & {
	ungrouped?: MemberProfile[];
};

export const members: Record<Roles, RoleMembers> = {
	"caucus-president": {
		ungrouped: [{ name: "Ella Lee" }, { name: "Richard Lin" }],
	},
	"chief-of-staff": {
		director: [
			{ name: "Olivia Zhou" },
			{
				name: "Thomas Vichaidith",
				image: "/pfps/directors/Thomas%20Vichaidith.jpeg",
			},
		],
	},
	"media-graphics-director": {
		director: [
			{ name: "Harper Chen", image: "/pfps/directors/Harper%20Chen.webp" },
			{ name: "Kathy Zhang", image: "/pfps/directors/Kathy%20Zhang.jpeg" },
			{
				name: "Violet Randall",
				image: "/pfps/directors/Violet%20Randall.jpeg",
			},
			{ name: "Ethan Li", image: "/pfps/directors/Ethan%20Li.jpg" },
		],
		"assistant-director": [
			{ name: "Riley Chan", image: "/pfps/directors/Riley%20Chan.jpeg" },
			{ name: "Claire Jiang", image: "/pfps/directors/Claire%20Jiang.jpg" },
		],
		member: [
			{ name: "Vicky Yu" },
			{ name: "Michelle Li" },
			{ name: "Evelina Ikeya-Tam" },
		],
	},
	"finance-director": {
		director: [
			{ name: "Sici Ma", image: "/pfps/directors/Sici%20Ma.jpeg" },
			{ name: "Allen Chen", image: "/pfps/directors/Allen%20Chen.png" },
		],
		"assistant-director": [
			{ name: "Celine Park", image: "/pfps/directors/Celine%20Park.jpeg" },
		],
		member: [{ name: "Rahui Lee" }, { name: "Mingxuan Zhang" }],
	},
	"events-director": {
		director: [
			{
				name: "Theresa Boabach",
				image: "/pfps/directors/Theresa%20Bosbach.jpeg",
			},
			{ name: "Sophie Yeh", image: "/pfps/directors/Sophie%20Yeh.jpeg" },
		],
		"assistant-director": [
			{ name: "Alexa Yuan", image: "/pfps/directors/Alexa%20Yuan.jpeg" },
		],
		member: [{ name: "Rio Deleon" }, { name: "Zoe Yuan-Lei" }],
	},
	"internals-director": {
		director: [
			{ name: "Pearl Lin", image: "/pfps/directors/Pearl%20Lin.jpeg" },
			{ name: "Stephen Ha", image: "/pfps/directors/Stephen%20Ha.jpeg" },
		],
		"assistant-director": [
			{ name: "Zhiyue Chen", image: "/pfps/directors/Zhi%20Yue%20Chen.jpeg" },
		],
		member: [
			{ name: "Sophie Chen" },
			{ name: "Darah (oruno) Bubu" },
			{ name: "Travis Yuan" },
		],
	},
	"externals-outreach-director": {
		director: [
			{ name: "Calista Loo", image: "/pfps/directors/Calista%20Loo.jpg" },
			{ name: "Emily Lei Du", image: "/pfps/directors/Emily%20Lei%20Du.JPG" },
		],
		"assistant-director": [
			{ name: "Linda Zheng", image: "/pfps/directors/Linda%20Zheng.jpeg" },
		],
		member: [{ name: "Isabella Figueiredo" }, { name: "Sofia Goihman" }],
	},
	"it-director": {
		director: [
			{
				name: "Makayla Kong-Kho",
				image: "/pfps/directors/Makayla%20Kong-Kho.jpeg",
			},
			{ name: "Nathan Lai" },
		],
		member: [{ name: "Jasmin Tam" }],
	},
};

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

export type MemberImageFit = "cover" | "contain";

export type MemberImageConfig = {
	fit?: MemberImageFit; // Ex: "cover", "contain"
	objectPosition?: string; // Ex: "center 22%", "50% 18%" "center"
	scale?: number; // Ex: 1.06, 0.95
	enabled?: boolean;
};

export type MemberProfile = {
	name: string;
	description?: string;
	image?: string;
	imageConfig?: MemberImageConfig;
};

export type RoleMembers = Partial<Record<MemberLevel, MemberProfile[]>> & {
	ungrouped?: MemberProfile[];
};

const defaultMemberImageConfig: MemberImageConfig = {
	fit: "cover",
	objectPosition: "center 28%",
};

const withImage = (
	image: string,
	imageConfig?: MemberImageConfig
): Pick<MemberProfile, "image" | "imageConfig"> => ({
	image,
	imageConfig: imageConfig ?? defaultMemberImageConfig,
});

export const members: Record<Roles, RoleMembers> = {
	"caucus-president": {
		ungrouped: [{ name: "Ella Lee" }, { name: "Richard Lin" }],
	},
	"chief-of-staff": {
		director: [
			{ name: "Olivia Zhou" },
			{
				name: "Thomas Vichaidith",
				...withImage("/pfps/directors/Thomas%20Vichaidith.jpeg"),
			},
		],
	},
	"media-graphics-director": {
		director: [
			{
				name: "Harper Chen",
				...withImage("/pfps/directors/Harper%20Chen.webp", {
					objectPosition: "31.9% 34.3%",
				}),
			},
			{
				name: "Kathy Zhang",
				...withImage("/pfps/directors/Kathy%20Zhang.jpeg", { scale: 1.04 }),
			},
			{
				name: "Violet Randall",
				...withImage("/pfps/directors/Violet%20Randall.jpeg"),
			},
			{
				name: "Ethan Li",
				...withImage("/pfps/directors/Ethan%20Li.jpg"),
			},
		],
		"assistant-director": [
			{
				name: "Riley Chan",
				...withImage("/pfps/directors/Riley%20Chan.jpeg"),
			},
			{
				name: "Claire Jiang",
				...withImage("/pfps/directors/Claire%20Jiang.jpg"),
			},
		],
		member: [
			{ name: "Vicky Yu" },
			{ name: "Michelle Li" },
			{ name: "Evelina Ikeya-Tam" },
		],
	},
	"finance-director": {
		director: [
			{ name: "Sici Ma", ...withImage("/pfps/directors/Sici%20Ma.jpeg") },
			{
				name: "Allen Chen",
				...withImage("/pfps/directors/Allen%20Chen.png", {
					objectPosition: "32.3% 40%",
				}),
			},
		],
		"assistant-director": [
			{
				name: "Celine Park",
				...withImage("/pfps/directors/Celine%20Park.jpeg"),
			},
		],
		member: [{ name: "Rahui Lee" }, { name: "Mingxuan Zhang" }],
	},
	"events-director": {
		director: [
			{
				name: "Theresa Boabach",
				...withImage("/pfps/directors/Theresa%20Bosbach.jpeg"),
			},
			{
				name: "Sophie Yeh",
				...withImage("/pfps/directors/Sophie%20Yeh.jpeg"),
			},
		],
		"assistant-director": [
			{
				name: "Alexa Yuan",
				...withImage("/pfps/directors/Alexa%20Yuan.jpeg"),
			},
		],
		member: [{ name: "Rio Deleon" }, { name: "Zoe Yuan-Lei" }],
	},
	"internals-director": {
		director: [
			{
				name: "Pearl Lin",
				...withImage("/pfps/directors/Pearl%20Lin.jpeg", {
					objectPosition: "52.7% 0%",
				}),
			},
			{
				name: "Stephen Ha",
				...withImage("/pfps/directors/Stephen%20Ha.jpg"),
			},
		],
		"assistant-director": [
			{
				name: "Zhiyue Chen",
				...withImage("/pfps/directors/Zhi%20Yue%20Chen.jpeg"),
			},
		],
		member: [
			{ name: "Sophie Chen" },
			{ name: "Darah (oruno) Bubu" },
			{ name: "Travis Yuan" },
		],
	},
	"externals-outreach-director": {
		director: [
			{
				name: "Calista Loo",
				...withImage("/pfps/directors/Calista%20Loo.jpg", {
					objectPosition: "29.9% 39.8%",
				}),
			},
			{
				name: "Emily Lei Du",
				...withImage("/pfps/directors/Emily%20Lei%20Du.JPG", {
					objectPosition: "34.7% 57.1%",
				}),
			},
		],
		"assistant-director": [
			{
				name: "Linda Zheng",
				...withImage("/pfps/directors/Linda%20Zheng.jpeg", {
					objectPosition: "26.2% 0%",
				}),
			},
		],
		member: [{ name: "Isabella Figueiredo" }, { name: "Sofia Goihman" }],
	},
	"it-director": {
		director: [
			{
				name: "Makayla Kong-Kho",
				...withImage("/pfps/directors/Makayla%20Kong-Kho.jpeg", {
					objectPosition: "27% 14.2%",
				}),
			},
			{ name: "Nathan Lai" },
		],
		member: [{ name: "Jasmin Tam" }],
	},
};

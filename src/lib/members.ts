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
		bg: "bg-sapphire/20",
		text: "text-sapphire",
		hoverBg: "hover:bg-sapphire/20",
		hoverText: "hover:text-sapphire",
		border: "border-sapphire",
	},
	"chief-of-staff": {
		bg: "bg-lavender/20",
		text: "text-lavender",
		hoverBg: "hover:bg-lavender/20",
		hoverText: "hover:text-lavender",
		border: "border-lavender",
	},
	"media-graphics-director": {
		bg: "bg-mauve/20",
		text: "text-mauve",
		hoverBg: "hover:bg-mauve/20",
		hoverText: "hover:text-mauve",
		border: "border-mauve",
	},
	"finance-director": {
		bg: "bg-yellow/20",
		text: "text-yellow",
		hoverBg: "hover:bg-yellow/20",
		hoverText: "hover:text-yellow",
		border: "border-yellow",
	},
	"events-director": {
		bg: "bg-peach/20",
		text: "text-peach",
		hoverBg: "hover:bg-peach/20",
		hoverText: "hover:text-peach",
		border: "border-peach",
	},
	"internals-director": {
		bg: "bg-teal/20",
		text: "text-teal",
		hoverBg: "hover:bg-teal/20",
		hoverText: "hover:text-teal",
		border: "border-teal",
	},
	"externals-outreach-director": {
		bg: "bg-green/20",
		text: "text-green",
		hoverBg: "hover:bg-green/20",
		hoverText: "hover:text-green",
		border: "border-green",
	},
	"it-director": {
		bg: "bg-blue/20",
		text: "text-blue",
		hoverBg: "hover:bg-blue/20",
		hoverText: "hover:text-blue",
		border: "border-blue",
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
	fit?: MemberImageFit;
	objectPosition?: string;
	scale?: number;
	enabled?: boolean;
};

export type MemberProfile = {
	name: string;
	description?: string;
	image?: string;
	imageConfig?: MemberImageConfig;
};

export type RoleMembers =
	| (Partial<Record<MemberLevel, MemberProfile[]>> & {
			ungrouped?: MemberProfile[];
	  })
	| undefined;

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
	"caucus-president": undefined,
	"chief-of-staff": undefined,
	"media-graphics-director": undefined,
	"finance-director": undefined,
	"events-director": undefined,
	"internals-director": undefined,
	"externals-outreach-director": undefined,
	"it-director": undefined,
};

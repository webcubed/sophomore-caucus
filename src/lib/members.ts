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

export const roleOrder = Object.keys(roleMeta) as Roles[];

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

export type MemberContact = {
	stuyEmail: string;
	nycEmail: string;
	personalEmail: string;
	phoneNumber: string;
	instagramHandle: string;
	discordUsername: string;
	preferredCommunication: string;
};

export type MemberDirectoryEntry = MemberProfile & {
	role: Roles;
	contact: MemberContact;
};

export type RoleMembers =
	| (Partial<Record<MemberLevel, MemberProfile[]>> & {
			ungrouped?: MemberProfile[];
	  })
	| undefined;

export const memberDirectory: MemberDirectoryEntry[] = [
	{
		role: "caucus-president",
		name: "Ella Lee",
		contact: {
			stuyEmail: "elee90@stuy.edu",
			nycEmail: "ellal36@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "caucus-president",
		name: "Thomas Vichaidith",
		image: "/pfps/directors/Thomas Vichaidith.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "tvichaidith90@stuy.edu",
			nycEmail: "thomasv63@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "chief-of-staff",
		name: "Pearl Lin",
		image: "/pfps/directors/Pearl Lin.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 16%",
		},
		contact: {
			stuyEmail: "plin90@stuy.edu",
			nycEmail: "pearll18@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "chief-of-staff",
		name: "Sydney Ma",
		image: "/pfps/directors/Sydney Ma.jpg",
		contact: {
			stuyEmail: "sma91@stuy.edu",
			nycEmail: "sydneym85@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "events-director",
		name: "Vismary Castillo",
		image: "/pfps/directors/Vismary Castillo.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "vcastillo90@stuy.edu",
			nycEmail: "vismaryc@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "events-director",
		name: "Alexa Yuan",
		image: "/pfps/directors/Alexa Yuan.png",
		imageConfig: {
			fit: "cover",
			objectPosition: "52% 21%",
		},
		contact: {
			stuyEmail: "ayuan90@stuy.edu",
			nycEmail: "alexay6@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "internals-director",
		name: "Travis Yuan",
		image: "/pfps/directors/Travis Yuan.jpg",
		contact: {
			stuyEmail: "tyuan90@stuy.edu",
			nycEmail: "travisy@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "internals-director",
		name: "Zhiyue Chen",
		image: "/pfps/directors/Zhi Yue Chen.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "zchen90@stuy.edu",
			nycEmail: "zhiyuec@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "internals-director",
		name: "Gina Chen",
		image: "/pfps/directors/Gina Chen.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "gchen90@stuy.edu",
			nycEmail: "ginac49@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "externals-outreach-director",
		name: "Calista Loo",
		image: "/pfps/directors/Calista Loo.jpeg",
		contact: {
			stuyEmail: "cloo90@stuy.edu",
			nycEmail: "calistal4@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "externals-outreach-director",
		name: "Vivian Li",
		image: "/pfps/directors/Vivian Li.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 0%",
		},
		contact: {
			stuyEmail: "vli91@stuy.edu",
			nycEmail: "vivianl202@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "finance-director",
		name: "Mingxuan Zhang",
		image: "/pfps/directors/Ming Xuan Zhang.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 59%",
		},
		contact: {
			stuyEmail: "mzhang92@stuy.edu",
			nycEmail: "mingxuanz5@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "finance-director",
		name: "Celine Park",
		image: "/pfps/directors/Celine Park.jpeg",
		contact: {
			stuyEmail: "cpark90@stuy.edu",
			nycEmail: "celinep30@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "it-director",
		name: "Makayla Kong-Kho",
		image: "/pfps/directors/Makayla K.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "mkong-kho90@stuy.edu",
			nycEmail: "makaylak17@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "it-director",
		name: "Nathan Lai",
		contact: {
			stuyEmail: "nlai90@stuy.edu",
			nycEmail: "nathanl99@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "it-director",
		name: "Will Yang",
		image: "/pfps/directors/Will Yang.webp",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 29%",
		},
		contact: {
			stuyEmail: "wyang90@stuy.edu",
			nycEmail: "willy@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "media-graphics-director",
		name: "Evan Hu",
		image: "/pfps/directors/Evan Hu.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 9%",
		},
		contact: {
			stuyEmail: "ehu90@stuy.edu",
			nycEmail: "evanh64@nycstudent.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "media-graphics-director",
		name: "Kathy Zhang",
		image: "/pfps/directors/Kathy Zhang.png",
		contact: {
			stuyEmail: "kzhang90@stuy.edu",
			nycEmail: "kathyz17@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "media-graphics-director",
		name: "Michelle Li",
		image: "/pfps/directors/Michelle Li.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 42%",
		},
		contact: {
			stuyEmail: "mli91@stuy.edu",
			nycEmail: "michellel375@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
	{
		role: "media-graphics-director",
		name: "Claire Jiang",
		image: "/pfps/directors/Claire Jiang.jpeg",
		imageConfig: {
			fit: "cover",
			objectPosition: "55% 21%",
		},
		contact: {
			stuyEmail: "cjiang92@stuy.edu",
			nycEmail: "clairej11@nycstudents.net",
			personalEmail: "REDACTED",
			phoneNumber: "REDACTED",
			instagramHandle: "REDACTED",
			discordUsername: "REDACTED",
			preferredCommunication: "REDACTED",
		},
	},
];

function buildMembersByRole(
	directory: MemberDirectoryEntry[]
): Record<Roles, RoleMembers> {
	const grouped = Object.fromEntries(
		roleOrder.map((role) => [role, { ungrouped: [] as MemberProfile[] }])
	) as Record<Roles, NonNullable<RoleMembers>>;

	for (const member of directory) {
		grouped[member.role].ungrouped?.push({
			name: member.name,
			description: member.contact.preferredCommunication,
			image: member.image,
			imageConfig: member.imageConfig,
		});
	}

	return grouped;
}

export const members: Record<Roles, RoleMembers> =
	buildMembersByRole(memberDirectory);

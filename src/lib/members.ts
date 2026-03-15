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

export type CabinetMember = {
	name: string;
	role: Roles;
	level?: MemberLevel;
	description?: string;
	imagePath?: string;
};

export const members: CabinetMember[] = [
	{
		name: "Julius Caesar",
		role: "caucus-president",
	},
	{
		name: "Cleopatra",
		role: "caucus-president",
	},
	{
		name: "Napoleon Bonaparte",
		role: "media-graphics-director",
		level: "director",
	},
	{
		name: "Joan of Arc",
		role: "externals-outreach-director",
		level: "director",
	},
	{
		name: "Leonardo da Vinci",
		role: "finance-director",
		level: "director",
	},
	{
		name: "Isaac Newton",
		role: "events-director",
		level: "director",
	},
	{
		name: "Albert Einstein",
		role: "internals-director",
		level: "director",
	},
	{
		name: "Marie Curie",
		role: "chief-of-staff",
		level: "director",
	},
	{
		name: "Ada Lovelace",
		role: "it-director",
		level: "director",
	},
	{
		name: "Charles Darwin",
		role: "media-graphics-director",
		level: "assistant-director",
	},
	{
		name: "Genghis Khan",
		role: "externals-outreach-director",
		level: "assistant-director",
	},
	{
		name: "Sun Tzu",
		role: "finance-director",
		level: "assistant-director",
		imagePath:
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ZcmBHOX_JBejsj1nKY8nkwHaIe%3Fpid%3DApi&f=1&ipt=eacc5c869d557f1f837b996b06658aa2a08e3c1b9f396921563f20437890717d&ipo=images",
	},
	{
		name: "Socrates",
		role: "events-director",
		level: "assistant-director",
	},
	{
		name: "Plato",
		role: "internals-director",
		level: "assistant-director",
	},
	{
		name: "Aristotle",
		role: "chief-of-staff",
		level: "assistant-director",
	},
	{
		name: "Galileo Galilei",
		role: "it-director",
		level: "assistant-director",
	},
	{
		name: "Nikola Tesla",
		role: "media-graphics-director",
		level: "member",
	},
	{
		name: "Ludwig van Beethoven",
		role: "externals-outreach-director",
		level: "member",
	},
	{
		name: "Wolfgang Amadeus Mozart",
		role: "finance-director",
		level: "member",
	},
	{
		name: "Frida Kahlo",
		role: "it-director",
		level: "member",
	},
	{
		name: "Vincent van Gogh",
		role: "events-director",
		level: "member",
	},
	{
		name: "William Shakespeare",
		role: "internals-director",
		level: "member",
	},
	{
		name: "Amelia Earhart",
		role: "chief-of-staff",
		level: "member",
	},
	{
		name: "Harriet Tubman",
		role: "it-director",
		level: "member",
	},
	{
		name: "Abraham Lincoln",
		role: "media-graphics-director",
		level: "member",
	},
	{
		name: "George Washington",
		role: "externals-outreach-director",
		level: "member",
	},
	{
		name: "Queen Victoria",
		role: "finance-director",
		level: "member",
	},
	{
		name: "Catherine the Great",
		role: "events-director",
		level: "member",
	},
	{
		name: "Mansa Musa",
		role: "internals-director",
		level: "member",
	},
	{
		name: "Saladin",
		role: "chief-of-staff",
		level: "member",
	},
	{
		name: "Marco Polo",
		role: "it-director",
		level: "member",
	},
	{
		name: "Ferdinand Magellan",
		role: "media-graphics-director",
		level: "member",
	},
	{
		name: "Zheng He",
		role: "externals-outreach-director",
		level: "member",
	},
	{
		name: "Akbar the Great",
		role: "finance-director",
		level: "member",
	},
	{
		name: "Hammurabi",
		role: "events-director",
		level: "member",
	},
];

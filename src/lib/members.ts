export const roleMeta = {
	"caucus-president": {
		label: "Caucus President",
		bg: "bg-ctp-sapphire/20",
		text: "text-ctp-sapphire",
		hoverBg: "hover:bg-ctp-sapphire/20",
		hoverText: "hover:text-ctp-sapphire",
		border: "border-ctp-sapphire",
	},
	"chief-of-staff": {
		label: "Chief of Staff",
		bg: "bg-ctp-lavender/20",
		text: "text-ctp-lavender",
		hoverBg: "hover:bg-ctp-lavender/20",
		hoverText: "hover:text-ctp-lavender",
		border: "border-ctp-lavender",
	},
	"it-director": {
		label: "IT Director",
		bg: "bg-ctp-blue/20",
		text: "text-ctp-blue",
		hoverBg: "hover:bg-ctp-blue/20",
		hoverText: "hover:text-ctp-blue",
		border: "border-ctp-blue",
	},
	"media-graphics-director": {
		label: "Media & Graphics Director",
		bg: "bg-ctp-mauve/20",
		text: "text-ctp-mauve",
		hoverBg: "hover:bg-ctp-mauve/20",
		hoverText: "hover:text-ctp-mauve",
		border: "border-ctp-mauve",
	},
	"externals-outreach-director": {
		label: "Externals/Outreach Director",
		bg: "bg-ctp-green/20",
		text: "text-ctp-green",
		hoverBg: "hover:bg-ctp-green/20",
		hoverText: "hover:text-ctp-green",
		border: "border-ctp-green",
	},
	"finance-director": {
		label: "Finance Director",
		bg: "bg-ctp-yellow/20",
		text: "text-ctp-yellow",
		hoverBg: "hover:bg-ctp-yellow/20",
		hoverText: "hover:text-ctp-yellow",
		border: "border-ctp-yellow",
	},
	"events-director": {
		label: "Events Director",
		bg: "bg-ctp-peach/20",
		text: "text-ctp-peach",
		hoverBg: "hover:bg-ctp-peach/20",
		hoverText: "hover:text-ctp-peach",
		border: "border-ctp-peach",
	},
	"internals-director": {
		label: "Internals Director",
		bg: "bg-ctp-teal/20",
		text: "text-ctp-teal",
		hoverBg: "hover:bg-ctp-teal/20",
		hoverText: "hover:text-ctp-teal",
		border: "border-ctp-teal",
	},
} as const;

export type Roles = keyof typeof roleMeta;

type CabinetMember = {
	name: string;
	role: Roles;
	description: string;
	imagePath?: string;
};
export const members: CabinetMember[] = [
	{
		name: "Julius Caesar",
		role: "caucus-president",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Cleopatra",
		role: "caucus-president",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Napoleon Bonaparte",
		role: "media-graphics-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Joan of Arc",
		role: "externals-outreach-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Leonardo da Vinci",
		role: "finance-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Isaac Newton",
		role: "events-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Albert Einstein",
		role: "internals-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Marie Curie",
		role: "chief-of-staff",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Ada Lovelace",
		role: "it-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Charles Darwin",
		role: "media-graphics-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Genghis Khan",
		role: "externals-outreach-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Sun Tzu",
		role: "finance-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		imagePath:
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ZcmBHOX_JBejsj1nKY8nkwHaIe%3Fpid%3DApi&f=1&ipt=eacc5c869d557f1f837b996b06658aa2a08e3c1b9f396921563f20437890717d&ipo=images",
	},
	{
		name: "Socrates",
		role: "events-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Plato",
		role: "internals-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Aristotle",
		role: "chief-of-staff",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Galileo Galilei",
		role: "it-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Nikola Tesla",
		role: "media-graphics-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Ludwig van Beethoven",
		role: "externals-outreach-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Wolfgang Amadeus Mozart",
		role: "finance-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Frida Kahlo",
		role: "it-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Vincent van Gogh",
		role: "events-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "William Shakespeare",
		role: "internals-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Amelia Earhart",
		role: "chief-of-staff",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Harriet Tubman",
		role: "it-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Abraham Lincoln",
		role: "media-graphics-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "George Washington",
		role: "externals-outreach-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Queen Victoria",
		role: "finance-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Catherine the Great",
		role: "events-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Mansa Musa",
		role: "internals-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Saladin",
		role: "chief-of-staff",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Marco Polo",
		role: "it-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Ferdinand Magellan",
		role: "media-graphics-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Zheng He",
		role: "externals-outreach-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Akbar the Great",
		role: "finance-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		name: "Hammurabi",
		role: "events-director",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
];

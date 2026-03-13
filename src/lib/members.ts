export const roleMeta = {
	"IT Director": {
		color: "lavender",
	},
	President: {
		color: "blue",
	},
	"chancelor of germany": {
		color: "green",
	},
	"Media Director": {
		color: "mauve",
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
		name: "a",
		role: "chancelor of germany",
		description: "lorem ipsum dolor sit amet",
	},
	{
		name: "b",
		role: "chancelor of germany",
		description: "lorem ipsum dolor sit amet",
	},
	{
		name: "peasant",
		role: "Media Director",
		description: "lorem ipsum dolor sit amet",
	},
	{
		name: "serf",
		role: "Media Director",
		description: "lorem ipsum dolor sit amet",
	},
];

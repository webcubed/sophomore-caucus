export type Roles =
	| "IT Director"
	| "President"
	| "chancelor of germany"
	| "Media Director";
export const roleColors: Record<Roles, string> = {
	"IT Director": "lavender",
	President: "blue",
	"chancelor of germany": "green",
	"Media Director": "mauve",
};
type cabinetMember = {
	name: string;
	role: Roles;
	description: string;
	imagePath?: string;
};
export const members: cabinetMember[] = [
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

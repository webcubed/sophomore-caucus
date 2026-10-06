import type { MacchiatoColor } from "@/lib/macchiato";
import { MACCHIATO } from "@/lib/macchiato";
import { defineField, defineType } from "sanity";

const colorList = (Object.keys(MACCHIATO) as MacchiatoColor[]).map((name) => ({
	title: `${name[0].toUpperCase()}${name.slice(1)}  ${MACCHIATO[name]}`,
	value: name,
}));

export const siteSettingsType = defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	initialValue: { accentColor: "blue" },
	fields: [
		defineField({
			name: "accentColor",
			title: "Accent color",
			type: "string",
			description:
				"Catppuccin Macchiato color used for the site accent (links, highlights, focus rings, today marker).",
			options: { list: colorList },
			validation: (Rule) =>
				Rule.required().custom(
					(value) =>
						(value && value in MACCHIATO) ||
						"Must be a Catppuccin Macchiato color"
				),
		}),
	],
});

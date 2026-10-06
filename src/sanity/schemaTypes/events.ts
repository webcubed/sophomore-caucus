import { colorList, MACCHIATO } from "@/lib/macchiato";
import { defineField, defineType } from "sanity";

export const eventType = defineType({
	name: "event",
	title: "Events",
	type: "document",
	fields: [
		defineField({
			name: "eventName",
			title: "Event Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "date",
			title: "Date",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "room",
			title: "Room",
			type: "number",
		}),
		defineField({
			name: "color",
			title: "Box color (Optional)",
			type: "string",
			description:
				"Catppuccin Macchiato color for the event box and calendar day. Falls back to a rotating palette.",
			options: { list: colorList },
			validation: (Rule) =>
				Rule.custom(
					(value) =>
						!value ||
						value in MACCHIATO ||
						"Must be a Catppuccin Macchiato color"
				),
		}),
		defineField({
			name: "image",
			title: "Image (Optional)",
			type: "image",
		}),
	],
});

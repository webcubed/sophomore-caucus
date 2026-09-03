import { defineField, defineType } from "sanity";

export const announcementType = defineType({
	name: "announcement",
	title: "Announcements",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "date",
			title: "Date Posted",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			of: [{ type: "block" }],
		}),
		defineField({
			name: "flyer",
			title: "Flyer / Image (Optional)",
			type: "image",
			options: { hotspot: true },
		}),
	],
});

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
            name: "image",
            title: "Image (Optional)",
            type: "image",
        })
    ]
});

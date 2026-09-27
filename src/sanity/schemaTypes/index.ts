import { type SchemaTypeDefinition } from "sanity";
import { announcementType } from "./announcement";
import { eventType } from "./events";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [announcementType, eventType],
};

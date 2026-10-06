import { type SchemaTypeDefinition } from "sanity";
import { announcementType } from "./announcement";
import { eventType } from "./events";
import { siteSettingsType } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [announcementType, eventType, siteSettingsType],
};

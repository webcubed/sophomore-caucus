import type { MacchiatoColor } from "@/lib/macchiato";
import { MACCHIATO } from "@/lib/macchiato";
import { client } from "./client";

export async function getAccentColor(): Promise<string> {
	try {
		const settings = await client.fetch<{ accentColor?: string } | null>(
			'*[_type == "siteSettings"][0]{accentColor}',
			{},
			{ next: { revalidate: 300 } }
		);
		const name = settings?.accentColor;
		return name && name in MACCHIATO
			? MACCHIATO[name as MacchiatoColor]
			: MACCHIATO.blue;
	} catch {
		return MACCHIATO.blue;
	}
}

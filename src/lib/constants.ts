import type { LucideIcon } from "lucide-react";
import {
	MessageSquare,
	MessagesSquare,
	ShelvingUnit,
	Toolbox,
} from "lucide-react";

export const pages: Array<{ href: string; label: string; icon: LucideIcon }> = [
	{ href: "/contact", label: "Contact", icon: MessagesSquare },
	{ href: "/cabinet", label: "Cabinet", icon: ShelvingUnit },
	{ href: "/resources", label: "Resources", icon: Toolbox },
];

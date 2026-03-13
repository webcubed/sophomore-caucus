import type { Roles } from "@/lib/members";
import { roleMeta } from "@/lib/members";
import React from "react";

import "@/styles/globals.css";

type ProfileProps = {
	name: string;
	role: Roles;
	imagePath?: string;
	description: string;
};

// Headshot on top, info on bottom including role in bold/accent color kinda like an egg
export const Profile: React.FC<ProfileProps> = ({
	name,
	role,
	imagePath,
	description,
}) => {
	return (
		<div className="flex flex-col rounded-lg border border-ctp-overlay0 p-8 bg-ctp-mantle/20 hover:-translate-y-1.5 hover:bg-ctp-mantle/10 transition-all cursor-pointer backdrop-blur-2xl">
			{imagePath ? <img src={imagePath} alt={name} /> : null}
			<h2>{name}</h2>
			<span className={`text-ctp-${roleMeta[role].color}`}>{role}</span>
			<p>{description}</p>
		</div>
	);
};

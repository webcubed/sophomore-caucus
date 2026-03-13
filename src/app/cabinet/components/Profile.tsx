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
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

	return (
		<div className="group flex h-full flex-col overflow-hidden rounded-xl border border-ctp-overlay0/80 bg-ctp-mantle/35 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 backdrop-blur-2xl hover:-translate-y-1 hover:border-ctp-overlay2 hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
			{imagePath ? (
				<div className="relative">
					<img
						src={imagePath}
						alt={name}
						className="h-52 w-full object-cover"
					/>
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ctp-base/45 via-transparent to-transparent" />
				</div>
			) : (
				<div className="flex h-52 w-full items-center justify-center bg-ctp-surface0/40">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-ctp-surface1/70 text-lg font-semibold text-ctp-subtext1">
						{initials}
					</div>
				</div>
			)}
			<div className="flex flex-1 flex-col gap-3 p-5">
				<h2 className="text-xl leading-tight">{name}</h2>
				<span
					className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${roleMeta[role].text} ${roleMeta[role].bg} ${roleMeta[role].border}`}
				>
					{roleMeta[role].label}
				</span>
				<p className="text-sm leading-relaxed text-ctp-subtext0 sm:text-base">
					{description}
				</p>
			</div>
		</div>
	);
};

import type { MemberImageConfig, MemberLevel, Roles } from "@/lib/members";
import { memberLevelMeta, roleMeta, roleStyles } from "@/lib/members";
import React from "react";

import "@/styles/globals.css";

type ProfileProps = {
	name: string;
	role: Roles;
	level?: MemberLevel;
	image?: string;
	imageConfig?: MemberImageConfig;
	description?: string;
};

// Headshot on top, info on bottom including role in bold/accent color kinda like an egg
export const Profile: React.FC<ProfileProps> = ({
	name,
	role,
	level,
	image,
	imageConfig,
	description,
}) => {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
	const showImage = Boolean(image) && imageConfig?.enabled !== false;
	const resolvedObjectPosition = imageConfig?.objectPosition ?? "center 28%";
	const imageStyle: React.CSSProperties = {
		objectFit: imageConfig?.fit ?? "cover",
		objectPosition: resolvedObjectPosition,
	};

	if (imageConfig?.scale && imageConfig.scale > 0) {
		imageStyle.transform = `scale(${imageConfig.scale})`;
		imageStyle.transformOrigin = resolvedObjectPosition;
	}

	return (
		<div className="group flex h-full flex-col overflow-hidden rounded-xl border border-ctp-overlay0/80 bg-ctp-mantle/35 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 backdrop-blur-2xl hover:-translate-y-1 hover:border-ctp-overlay2 hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
			{showImage && image ? (
				<div className="relative overflow-hidden bg-ctp-surface0/40">
					<img
						src={image}
						alt={name}
						className="h-52 w-full"
						style={imageStyle}
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
				<div className="flex flex-wrap items-center gap-2">
					<span
						className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles[role].text} ${roleStyles[role].bg} ${roleStyles[role].border}`}
					>
						{roleMeta[role].label}
					</span>
					{level ? (
						<span className="inline-flex w-fit rounded-full border border-ctp-overlay1 bg-ctp-surface0/60 px-2.5 py-1 text-xs font-medium text-ctp-subtext0">
							{memberLevelMeta[level].label}
						</span>
					) : null}
				</div>
				{description ? (
					<p className="text-sm leading-relaxed text-ctp-subtext0 sm:text-base">
						{description}
					</p>
				) : null}
			</div>
		</div>
	);
};

import Link from "next/link";
import React from "react";

import "@/styles/globals.css";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type HeroCardProps = {
	className?: string;
	title: string;
	description?: string;
	icon?: LucideIcon;
	height: number;
	width: number;
	href: string;
};

export const HeroCard: React.FC<HeroCardProps> = ({
	className = "",
	title,
	description,
	icon,
	height,
	width,
	href,
}) => {
	const HeroIcon = icon;
	const showDescription = Boolean(description) && (height >= 2 || width >= 2);
	const iconClass =
		height >= 3 ? "h-14 w-14" : height === 2 ? "h-12 w-12" : "h-9 w-9";
	const titleClass = "text-sm";
	const descriptionClass = height >= 2 ? "text-sm" : "text-xs";

	return (
		<Link
			href={href}
			className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-ctp-overlay0/80 bg-ctp-mantle/35 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 backdrop-blur-2xl hover:-translate-y-1 hover:border-ctp-overlay2 hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)] ${className}`}
			style={{
				gridColumn: `span ${width} / span ${width}`,
				gridRow: `span ${height} / span ${height}`,
			}}
		>
			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ctp-base/78 via-ctp-surface0/52 to-transparent opacity-90 transition-all duration-300 group-hover:from-ctp-base/92 group-hover:via-ctp-surface0/70" />
			<div className="relative flex min-h-0 flex-1 items-center justify-center bg-ctp-surface0/22">
				{HeroIcon ? (
					<HeroIcon
						className={`${iconClass} text-ctp-subtext0 transition-transform duration-300 group-hover:scale-105`}
					/>
				) : null}
			</div>
			<div className="relative z-10 flex h-14 shrink-0 items-center border-t border-ctp-overlay0/35 bg-ctp-base/22 pl-4 pr-10">
				<div className="min-w-0">
					<h2 className={`truncate leading-tight ${titleClass}`}>{title}</h2>
					{showDescription ? (
						<p
							className={`truncate leading-snug text-ctp-subtext1 ${descriptionClass}`}
						>
							{description}
						</p>
					) : null}
				</div>
				<ArrowRight className="pointer-events-none absolute right-3 h-4 w-4 shrink-0 text-ctp-subtext1 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ctp-text" />
			</div>
		</Link>
	);
};

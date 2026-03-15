import React from "react";

import "@/styles/globals.css";

import { type LucideIcon } from "lucide-react";

type HeroCardProps = {
	className?: string;
	title: string;
	icon?: LucideIcon;
	height: number;
	width: number;
};

export const HeroCard: React.FC<HeroCardProps> = ({
	className = "",
	title,
	icon,
	height,
	width,
}) => {
	return (
		<div className="group relative w-fit">
			<div
				className={`flex relative rounded-lg border border-ctp-overlay1/50 p-6 glass-colored transition-all duration-300 hover:shadow-[0px_12px_28px_rgba(0,0,0,0.2)] hover:border-ctp-overlay1/70 ${className}`}
			>
				<div></div>
			</div>
		</div>
	);
};

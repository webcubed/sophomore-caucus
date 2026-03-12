import React from "react";

import "@/styles/globals.css";

type CardProps = {
	children: React.ReactNode;
	className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
	return (
		<div className="group relative w-fit">
			{/* Main card */}
			<div
				className={`relative rounded-lg border border-ctp-overlay1/50 p-6 glass-colored transition-all duration-300 hover:shadow-[0px_12px_28px_rgba(0,0,0,0.2)] hover:border-ctp-overlay1/70 ${className}`}
			>
				<div className="relative z-10">{children}</div>
			</div>
		</div>
	);
};

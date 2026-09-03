import React from "react";

type CardProps = {
	children: React.ReactNode;
	className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
	return (
		<div
			className={`rounded-lg border border-overlay1/50 bg-surface0/50 p-6 ${className}`}
		>
			{children}
		</div>
	);
};

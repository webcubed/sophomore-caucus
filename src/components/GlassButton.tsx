import type { ReactNode } from "react";

type GlassButtonProps = {
	onClick?: () => void;
	children?: ReactNode;
	variant?: "primary" | "secondary" | "danger";
	type?: "button" | "submit" | "reset";
	className?: string;
	title?: string;
	disabled?: boolean;
	icon?: ReactNode;
	iconPosition?: "left" | "right";
};

export const GlassButton: React.FC<GlassButtonProps> = ({
	onClick,
	children,
	variant = "primary",
	type = "button",
	className = "",
	title,
	disabled = false,
	icon,
	iconPosition = "left",
}) => {
	const variantClasses = {
		primary:
			"border-overlay1/60 bg-surface1/60 text-text hover:bg-surface1/80",
		secondary:
			"border-overlay1/60 bg-surface0/60 text-subtext1 hover:bg-surface0/80",
		danger:
			"border-overlay1/60 bg-surface1/60 text-subtext1 hover:bg-red/10 hover:text-red",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			title={title}
			disabled={disabled}
			className={`inline-flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
		>
			{icon && iconPosition === "left" && (
				<span className={children ? "mr-2" : ""}>{icon}</span>
			)}
			{children}
			{icon && iconPosition === "right" && (
				<span className={children ? "ml-2" : ""}>{icon}</span>
			)}
		</button>
	);
};

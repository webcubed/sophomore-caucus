import type { ReactNode } from "react";
import {
	Check,
	Copy,
	ExternalLink,
} from "lucide-react";

type ContactLineProps = {
	fieldKey: string;
	label: string;
	value: string;
	href?: string;
	copyValue: string;
	copied: boolean;
	onCopy: (fieldKey: string, value: string) => void;
};

export function ContactLine({
	fieldKey,
	label,
	value,
	href,
	copyValue,
	copied,
	onCopy,
}: ContactLineProps) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-xl border border-overlay1/70 bg-surface1/75 px-3 py-3 shadow-inner shadow-base/20 transition-colors hover:border-overlay2/80 hover:bg-surface1/90">
			<div className="min-w-0 flex-1">
				<span className="block text-sm font-medium text-subtext1">{label}</span>
				<span className="mt-1 block break-all text-sm font-semibold text-text">{value}</span>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<button
					type="button"
					onClick={() => onCopy(fieldKey, copyValue)}
					className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-overlay1/70 bg-surface0/80 px-3 py-2 text-xs font-semibold text-subtext1 transition-colors hover:border-overlay2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
					aria-label={`Copy ${label}`}
				>
					{copied ? (
						<Check className="h-3.5 w-3.5" aria-hidden />
					) : (
						<Copy className="h-3.5 w-3.5" aria-hidden />
					)}
				</button>
				{href && (
					<a
						href={href}
						target={href.startsWith("http") ? "_blank" : undefined}
						rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
						className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-overlay1/70 bg-surface0/80 px-3 py-2 text-xs font-semibold text-subtext1 transition-colors hover:border-overlay2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
						aria-label={`Open ${label}`}
					>
						<ExternalLink className="h-3.5 w-3.5" aria-hidden />
					</a>
				)}
			</div>
		</div>
	);
}

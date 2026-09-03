"use client";

import { GlassButton } from "@/components/GlassButton";

type ConfirmProps = {
	open: boolean;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export default function Confirm({
	open,
	title = "Confirm",
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
}: ConfirmProps) {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
		>
			<div className="w-full max-w-sm rounded-lg border border-overlay1/40 bg-surface0/95 p-6 shadow-xl backdrop-blur-xl">
				<h2 id="confirm-title" className="mb-2 text-lg font-semibold text-text">
					{title}
				</h2>
				{description && (
					<p className="mb-4 text-sm text-subtext1">{description}</p>
				)}

				<div className="flex gap-3">
					<GlassButton onClick={onConfirm} variant="danger" className="flex-1">
						{confirmLabel}
					</GlassButton>

					<GlassButton
						onClick={onCancel}
						variant="secondary"
						className="flex-1"
					>
						{cancelLabel}
					</GlassButton>
				</div>
			</div>
		</div>
	);
}

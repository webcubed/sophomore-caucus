"use client";

import type { ReactNode } from "react";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ExpandableImageProps = {
	/** Full-size image source shown in the overlay */
	src: string;
	alt: string;
	/** Classes for the clickable thumbnail trigger */
	className?: string;
	/** aria-label for the trigger; defaults to a label derived from alt */
	label?: string;
	children: ReactNode;
};

export function ExpandableImage({
	src,
	alt,
	className,
	label,
	children,
}: ExpandableImageProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				// Capture phase + immediate stop so parent modals don't close too
				event.stopImmediatePropagation();
				setOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown, true);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown, true);
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={(event) => {
					event.stopPropagation();
					setOpen(true);
				}}
				aria-label={label ?? `View full image of ${alt}`}
				className={`group/img relative ${className ?? ""}`}
			>
				{children}
				{/* Hover affordance: the image opens full-size (separate from the
				    surrounding card) */}
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/10 opacity-0 transition-opacity duration-150 group-focus-visible/img:opacity-100 group-hover/img:opacity-100"
				>
					<ZoomIn className="h-5 w-5 text-white/90 drop-shadow" />
				</span>
			</button>
			{open &&
				createPortal(
					<div
						className="fixed inset-0 z-60 flex items-center justify-center bg-base/95 p-4 backdrop-blur-md"
						onClick={(event) => {
							event.stopPropagation();
							setOpen(false);
						}}
						role="dialog"
						aria-modal="true"
						aria-label={`Full image of ${alt}`}
					>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								setOpen(false);
							}}
							className="fixed right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-overlay1/60 bg-surface0/70 text-subtext1 transition-colors hover:border-overlay2 hover:text-text"
							aria-label="Close image"
						>
							<X className="h-4 w-4" aria-hidden />
						</button>
						<img
							src={src}
							alt={alt}
							onClick={(event) => event.stopPropagation()}
							className="max-h-[90vh] max-w-full rounded-xl border border-overlay1/60 object-contain shadow-2xl"
						/>
					</div>,
					document.body
				)}
		</>
	);
}

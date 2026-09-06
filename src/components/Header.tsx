"use client";

import "@/styles/globals.css";

import type { NavHighlight } from "@/lib/constants";
import { pages } from "@/lib/constants";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HighlightStyles = {
	active: string;
	mobileActive: string;
	hover: string;
};

const highlightStyles: Record<NavHighlight, HighlightStyles> = {
	accent: {
		active: "text-accent bg-accent/15",
		mobileActive:
			"text-accent bg-accent/15 backdrop-blur-md border border-accent/20 ring-1 ring-accent/20",
		hover: "hover:bg-accent/10 hover:ring-1 hover:ring-accent/20",
	},
	green: {
		active: "text-green bg-green/15",
		mobileActive:
			"text-green bg-green/15 backdrop-blur-md border border-green/20 ring-1 ring-green/20",
		hover: "hover:bg-green/10 hover:ring-1 hover:ring-green/20",
	},
	peach: {
		active: "text-peach bg-peach/15",
		mobileActive:
			"text-peach bg-peach/15 backdrop-blur-md border border-peach/20 ring-1 ring-peach/20",
		hover: "hover:bg-peach/10 hover:ring-1 hover:ring-peach/20",
	},
	sapphire: {
		active: "text-sapphire bg-sapphire/15",
		mobileActive:
			"text-sapphire bg-sapphire/15 backdrop-blur-md border border-sapphire/20 ring-1 ring-sapphire/20",
		hover: "hover:bg-sapphire/10 hover:ring-1 hover:ring-sapphire/20",
	},
	yellow: {
		active: "text-yellow bg-yellow/15",
		mobileActive:
			"text-yellow bg-yellow/15 backdrop-blur-md border border-yellow/20 ring-1 ring-yellow/20",
		hover: "hover:bg-yellow/10 hover:ring-1 hover:ring-yellow/20",
	},
};

export default function Header() {
	const [navOpen, setNavOpen] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(104);
	const [hidden, setHidden] = useState(false);
	const pathname = usePathname();
	const headerRef = useRef<HTMLHeadingElement>(null);
	if (pathname?.startsWith("/studio")) {
		return null;
	}

	const headerScrollConfig = {
		enabled:
			(process.env.NEXT_PUBLIC_HEADER_HIDE_ON_SCROLL ?? "true") === "true",
		hideDownThreshold: 36,
		showUpThreshold: 12,
		debounceMs: 200,
		minTop: 8,
	};

	useEffect(() => {
		const measureHeader = () => {
			if (headerRef.current) {
				setHeaderHeight(headerRef.current.getBoundingClientRect().height);
			}
		};

		requestAnimationFrame(() => {
			setTimeout(measureHeader, 0);
		});
		window.addEventListener("resize", measureHeader);
		return () => {
			window.removeEventListener("resize", measureHeader);
		};
	}, []);

	useEffect(() => {
		if (!headerRef.current) return;
		setHeaderHeight(headerRef.current.getBoundingClientRect().height);
	}, [navOpen]);

	useEffect(() => {
		setHidden(false);
		setNavOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!headerScrollConfig.enabled) return;
		let lastY = window.scrollY || 0;
		let accumDown = 0;
		let accumUp = 0;
		let timeout: ReturnType<typeof setTimeout> | undefined;

		const prefersReducedMotion = globalThis.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		const onScroll = () => {
			const y = window.scrollY || 0;
			const delta = y - lastY;
			if (delta > 0) {
				accumDown += delta;
				accumUp = 0;
				if (
					y > headerScrollConfig.minTop &&
					accumDown > headerScrollConfig.hideDownThreshold
				) {
					setHidden(true);
				}
			} else if (delta < 0) {
				accumUp += -delta;
				accumDown = 0;
				if (accumUp > headerScrollConfig.showUpThreshold) {
					setHidden(false);
				}
			}

			lastY = y;
		};

		const debounced = () => {
			if (prefersReducedMotion) {
				onScroll();
				return;
			}

			globalThis.clearTimeout(timeout);
			timeout = globalThis.setTimeout(onScroll, headerScrollConfig.debounceMs);
		};

		window.addEventListener("scroll", debounced, { passive: true });
		return () => {
			window.removeEventListener(
				"scroll",
				debounced as unknown as EventListener
			);
			if (timeout) globalThis.clearTimeout(timeout);
		};
	}, []);

	return (
		<>
			<header
				ref={headerRef}
				className={`fixed top-3 left-0 right-0 z-40 mx-4 sm:mx-auto max-w-7xl rounded-lg border border-overlay1/60 bg-surface0/95 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl shadow-lg transition duration-200 ${hidden ? "translate-y-[-150%] opacity-0" : "translate-y-0 opacity-100"}`}
			>
				<div className="flex flex-wrap items-center justify-between gap-3 sm:gap-8">
					<div className="shrink-0">
						<a
							href="/"
							className="inline-flex items-center gap-3 text-text transition-colors duration-200"
						>
							<h1 className="text-lg font-bold sm:inline">Sophomore Caucus</h1>
						</a>
					</div>
					{/* Navigation */}
					<nav className="flex-1 hidden sm:block" aria-label="Primary">
						<div
							id="primary-navigation"
							className="flex items-center justify-center gap-2"
						>
							{pages.map((page) => {
								const isActive = pathname === page.href;
								const PageIcon = page.icon;
								const styles = highlightStyles[page.highlightColor];
								return (
									<a
										key={page.href}
										href={page.href}
										className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition cursor-pointer ${isActive ? styles.active : `text-text ${styles.hover}`}`}
									>
										<PageIcon className="w-4 h-4" />
										{page.label}
									</a>
								);
							})}
						</div>
					</nav>
					{/* Actions */}
					<div className="shrink-0 flex items-center gap-2 sm:gap-3">
						{/* Mobile nav toggle */}
						<button
							type="button"
							className="inline-flex sm:hidden cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-overlay1/60 bg-surface1/60 text-subtext1 transition duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
							onClick={() => {
								setNavOpen((v) => !v);
							}}
							aria-label="Toggle navigation"
							aria-expanded={navOpen}
							aria-controls="mobile-primary-navigation"
						>
							<Menu className="h-4 w-4" aria-hidden />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile menu panel */}
			{navOpen ? (
				<div
					className="fixed z-40 sm:hidden px-4 inset-x-0"
					style={{ top: headerHeight + 16 }}
				>
					<div
						id="mobile-primary-navigation"
						role="menu"
						className="rounded-xl border border-overlay1/70 bg-surface0/95 p-3 shadow-lg backdrop-blur-xl"
					>
						<div className="flex flex-col gap-2">
							{pages.map((page) => {
								const isActive = pathname === page.href;
								const PageIcon = page.icon;
								const styles = highlightStyles[page.highlightColor];
								return (
									<a
										key={page.href}
										href={page.href}
										className={`flex gap-1 items-center rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current cursor-pointer ${isActive ? styles.mobileActive : `text-text ${styles.hover}`}`}
									>
										<PageIcon className="w-4 h-4" />
										{page.label}
									</a>
								);
							})}
						</div>
					</div>
				</div>
			) : null}

			{/* Keep spacer constant to avoid layout shift causing bounce */}
			<div aria-hidden style={{ height: headerHeight + 32 }} />
		</>
	);
}

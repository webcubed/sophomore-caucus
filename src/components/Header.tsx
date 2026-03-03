"use client";

import "@/styles/globals.css";

import type { Flavor } from "@/lib/theme";
import { useTheme } from "@/hooks/use-theme";
import { flavors } from "@/lib/theme";
import { Check, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const pages: Array<{ href: string; label: string }> = [
	{ href: "/connect", label: "Connect" },
];

export default function Header() {
	const { flavor, setFlavor, mounted } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(104);
	const [hidden, setHidden] = useState(false);
	const pathname = usePathname();
	const headerRef = useRef<HTMLHeadingElement>(null);

	// Header behavior config
	const headerScrollConfig = {
		enabled:
			(process.env.NEXT_PUBLIC_HEADER_HIDE_ON_SCROLL ?? "true") === "true",
		hideDownThreshold: 36, // Px of downward scroll before hiding
		showUpThreshold: 12, // Px of upward scroll before showing
		debounceMs: 200,
		minTop: 8, // Don't hide when near the top
	};

	useEffect(() => {
		// Get height to set to dropdown
		const measureHeader = () => {
			if (headerRef.current) {
				setHeaderHeight(headerRef.current.getBoundingClientRect().height);
			}
		};

		// Ensure update on change
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
	}, [menuOpen, navOpen]);

	// Reset hidden state on route change
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
	}, [mounted]);

	const handleFlavorChange = (nextFlavor: Flavor) => {
		setFlavor(nextFlavor);
		setMenuOpen(false);
	};

	const currentFlavor = flavors.find((entry) => entry.value === flavor);

	const wordmarkStart = currentFlavor ? currentFlavor.swatch[1] : "#ffffff";
	const wordmarkEnd = currentFlavor ? currentFlavor.swatch[2] : "#ffffff";

	return (
		<>
			<header
				ref={headerRef}
				className={`fixed top-3 left-0 right-0 z-40 mx-4 sm:mx-auto max-w-4xl rounded-lg border border-ctp-overlay1/60 bg-linear-to-br from-ctp-surface0/75 via-ctp-base/65 to-ctp-surface0/55 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-2xl shadow-[0px_18px_38px_rgba(0,0,0,0.35),0px_0px_24px_rgba(148,163,184,0.16)] ring-1 ring-ctp-overlay1/35 transition duration-200 ${hidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"}`}
			>
				{/* Logo */}
				<div className="flex flex-wrap items-center justify-between gap-3 sm:gap-8">
					<div className="shrink-0">
						<a
							href="/"
							className="inline-flex items-center gap-3 text-ctp-text hover:text-ctp-lavender transition-colors duration-200"
						>
							<img
								src="/logo.png"
								alt="Freshman Caucus logo"
								className="h-10 w-10 select-none rounded-full"
								loading="lazy"
								decoding="async"
							/>
							<span className="font-semibold text-base sm:inline">
								Freshman Caucus
							</span>
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
								return (
									<a
										key={page.href}
										href={page.href}
										className={`rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-ctp-lavender/60 cursor-pointer ${isActive ? "text-ctp-lavender bg-ctp-surface1/70 backdrop-blur-md border border-ctp-overlay1/40 shadow-[0px_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-ctp-lavender/20" : "text-ctp-text hover:bg-ctp-surface1/60 hover:text-ctp-lavender hover:ring-1 hover:ring-ctp-lavender/30 hover:shadow-[0px_8px_16px_rgba(202,166,247,0.1)]"}`}
									>
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
							className="inline-flex sm:hidden cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-ctp-overlay1/60 bg-ctp-surface1/60 text-ctp-subtext1 shadow-[0px_6px_12px_rgba(0,0,0,0.18)] transition duration-150 hover:-translate-y-px hover:border-ctp-lavender/60 hover:bg-ctp-surface1/90 hover:text-ctp-text hover:shadow-[0px_10px_18px_rgba(0,0,0,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctp-lavender/60"
							onClick={() => {
								setNavOpen((v) => !v);
							}}
							aria-label="Toggle navigation"
							aria-expanded={navOpen}
							aria-controls="mobile-primary-navigation"
						>
							<Menu className="h-4 w-4" aria-hidden />
						</button>
						{/* TEMPORARILY DISABLED */}
						<div className="relative hidden">
							<button
								type="button"
								disabled={!mounted}
								onClick={() => {
									setMenuOpen((open) => !open);
								}}
								title="Switch Catppuccin flavour"
								className="flex h-10 w-10 sm:h-auto sm:w-auto sm:gap-2 justify-center items-center rounded-lg border border-ctp-overlay1/60 bg-linear-to-br from-ctp-surface0/80 via-ctp-surface0/60 to-ctp-base/45 px-0 sm:px-5 py-2 sm:py-3 text-xs font-semibold text-ctp-subtext0 shadow-[0px_14px_30px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition hover:-translate-y-px hover:shadow-[0px_18px_36px_rgba(0,0,0,0.38)] hover:ring-2 hover:ring-ctp-lavender/35 focus-visible:outline-2 focus-visible:outline-ctp-lavender/60 disabled:opacity-70 cursor-pointer"
								aria-expanded={menuOpen}
								aria-controls="theme-menu"
							>
								<span className="text-base" aria-hidden>
									{currentFlavor?.icon ?? "🌿"}
								</span>
								<span className="text-ctp-overlay1 hidden sm:inline">▾</span>
							</button>
							{menuOpen ? (
								<div
									id="theme-menu"
									role="menu"
									className="absolute right-0 mt-2 sm:mt-3 w-max sm:w-72 z-50 rounded-lg sm:rounded-2xl border border-ctp-overlay1/70 bg-ctp-surface0/92 p-2 sm:p-3 shadow-[0px_20px_42px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
								>
									<div className="flex flex-col gap-2">
										{flavors.map((entry) => {
											const isActive = entry.value === flavor;
											return (
												<button
													key={entry.value}
													type="button"
													disabled={!mounted}
													onClick={() => {
														handleFlavorChange(entry.value);
													}}
													className={`w-full rounded-lg sm:rounded-xl border px-2 sm:px-3 py-2 sm:py-3 text-left transition cursor-pointer ${
														isActive
															? "border-ctp-lavender/60 bg-ctp-surface1 shadow-[0px_10px_20px_rgba(0,0,0,0.24)]"
															: "border-ctp-overlay1/70 hover:bg-ctp-surface1/70 hover:-translate-y-px hover:shadow-[0px_10px_18px_rgba(0,0,0,0.2)]"
													}`}
												>
													<div className="flex items-center justify-between gap-2">
														<div className="flex items-center gap-2 sm:gap-3">
															<span className="text-lg" aria-hidden>
																{entry.icon}
															</span>
															<div className="block">
																<p className="text-sm font-semibold text-ctp-text">
																	{entry.label}
																</p>
																<p className="text-[11px] text-ctp-subtext1">
																	{entry.note}
																</p>
															</div>
														</div>
														{isActive ? (
															<Check
																className="h-4 w-4 text-ctp-lavender"
																aria-hidden
															/>
														) : null}
													</div>
													<div className="mt-2 sm:mt-3 flex flex-col gap-1 sm:gap-2">
														<div className="flex gap-1">
															{entry.backgrounds.map((color, index) => (
																<span
																	key={`bg-${entry.value}-${index}`}
																	className="h-2.5 sm:h-3 flex-1 rounded-md border border-ctp-overlay1/70"
																	style={{ backgroundColor: color }}
																/>
															))}
														</div>
														<div className="flex gap-1">
															{entry.swatch.map((color, index) => (
																<span
																	key={`sw-${entry.value}-${index}`}
																	className="h-2.5 sm:h-3 flex-1 rounded-md border border-ctp-overlay1/70"
																	style={{ backgroundColor: color }}
																/>
															))}
														</div>
													</div>
												</button>
											);
										})}
									</div>
								</div>
							) : null}
						</div>
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
						className="rounded-xl border border-ctp-overlay1/70 bg-ctp-surface0/92 p-3 shadow-[0px_20px_42px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
					>
						<div className="flex flex-col gap-2">
							{pages.map((page) => {
								const isActive = pathname === page.href;
								return (
									<a
										key={page.href}
										href={page.href}
										className={`rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-ctp-lavender/60 cursor-pointer ${isActive ? "text-ctp-lavender bg-ctp-surface1/70 backdrop-blur-md border border-ctp-overlay1/40 shadow-[0px_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-ctp-lavender/20" : "text-ctp-text hover:bg-ctp-surface1/60 hover:text-ctp-lavender hover:ring-1 hover:ring-ctp-lavender/30 hover:shadow-[0px_8px_16px_rgba(202,166,247,0.1)]"}`}
									>
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

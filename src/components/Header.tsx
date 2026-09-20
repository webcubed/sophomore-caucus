"use client";

import { pages } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { highlightStyles, type HighlightStyles } from "./highlightStyles";
import { useHeaderScroll } from "./useHeaderScroll";

export function MobileNav({ navOpen, headerHeight }: { navOpen: boolean; headerHeight: number }) {
	if (!navOpen) return null;
	const pathname = usePathname();

	return (
		<div className="fixed z-40 sm:hidden px-4 inset-x-0" style={{ top: headerHeight + 16 }}>
			<div id="mobile-primary-navigation" role="menu" className="rounded-xl border border-overlay1/70 bg-surface0/95 p-3 shadow-lg backdrop-blur-xl">
				<div className="flex flex-col gap-2">
					{pages.map((page) => {
						const isActive = pathname === page.href;
						const PageIcon = page.icon;
						const styles = highlightStyles[page.highlightColor] as HighlightStyles;
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
	);
}

export function Header() {
	const [navOpen, setNavOpen] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(104);
	const pathname = usePathname();
	const headerRef = useRef<HTMLHeadingElement>(null);
	const hidden = useHeaderScroll(pathname);

	if (pathname?.startsWith("/studio")) return null;

	useEffect(() => {
		const measureHeader = () => {
			if (headerRef.current) {
				setHeaderHeight(headerRef.current.getBoundingClientRect().height);
			}
		};
		requestAnimationFrame(() => setTimeout(measureHeader, 0));
		window.addEventListener("resize", measureHeader);
		return () => window.removeEventListener("resize", measureHeader);
	}, []);

	useEffect(() => {
		if (!headerRef.current) return;
		setHeaderHeight(headerRef.current.getBoundingClientRect().height);
	}, [navOpen]);

	useEffect(() => {
		setNavOpen(false);
	}, [pathname]);

	return (
		<>
			<header
				ref={headerRef}
				className={`fixed top-3 left-0 right-0 z-40 mx-4 sm:mx-auto max-w-7xl rounded-lg border border-overlay1/60 bg-surface0/95 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl shadow-lg transition duration-200 ${hidden ? "translate-y-[-150%] opacity-0" : "translate-y-0 opacity-100"}`}
			>
				<div className="flex flex-wrap items-center justify-between gap-3 sm:gap-8">
					<div className="shrink-0">
						<a href="/" className="inline-flex items-center gap-3 text-text transition-colors duration-200">
							<h1 className="text-lg font-bold sm:inline">Sophomore Caucus</h1>
						</a>
					</div>
					<nav className="flex-1 hidden sm:block" aria-label="Primary">
						<div id="primary-navigation" className="flex items-center justify-center gap-2">
							{pages.map((page) => {
								const isActive = pathname === page.href;
								const PageIcon = page.icon;
								const styles = highlightStyles[page.highlightColor] as HighlightStyles;
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
					<div className="shrink-0 flex items-center gap-2 sm:gap-3">
						<button
							type="button"
							className="inline-flex sm:hidden cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-overlay1/60 bg-surface1/60 text-subtext1 transition duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
							onClick={() => setNavOpen((v) => !v)}
							aria-label="Toggle navigation"
							aria-expanded={navOpen}
							aria-controls="mobile-primary-navigation"
						>
							<Menu className="h-4 w-4" aria-hidden />
						</button>
					</div>
				</div>
			</header>
			<MobileNav navOpen={navOpen} headerHeight={headerHeight} />
			<div aria-hidden style={{ height: headerHeight + 32 }} />
		</>
	);
}

export default Header;

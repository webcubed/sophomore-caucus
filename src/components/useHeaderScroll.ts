import { useState, useEffect } from "react";

export type ScrollConfig = {
	enabled: boolean;
	hideDownThreshold: number;
	showUpThreshold: number;
	debounceMs: number;
	minTop: number;
};

export const headerScrollConfig: ScrollConfig = {
	enabled: (process.env.NEXT_PUBLIC_HEADER_HIDE_ON_SCROLL ?? "true") === "true",
	hideDownThreshold: 36,
	showUpThreshold: 12,
	debounceMs: 200,
	minTop: 8,
};

export function useHeaderScroll(pathname: string) {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		setHidden(false);
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
				if (y > headerScrollConfig.minTop && accumDown > headerScrollConfig.hideDownThreshold) {
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
			if (prefersReducedMotion) { onScroll(); return; }
			globalThis.clearTimeout(timeout);
			timeout = globalThis.setTimeout(onScroll, headerScrollConfig.debounceMs);
		};

		window.addEventListener("scroll", debounced, { passive: true });
		return () => {
			window.removeEventListener("scroll", debounced as unknown as EventListener);
			if (timeout) globalThis.clearTimeout(timeout);
		};
	}, []);

	return hidden;
}

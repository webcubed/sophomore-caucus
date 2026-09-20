import type { MemberImageConfig, MemberLevel, Roles } from "@/lib/members";
import { memberLevelMeta, roleMeta, roleStyles } from "@/lib/members";
import React, { useCallback, useEffect, useState } from "react";

import "@/styles/globals.css";

type ProfileConfig = { fit?: string; objectPosition: string; scale: number };

type ProfileProps = {
	name: string; role: Roles; level?: MemberLevel; image?: string;
	imageConfig?: MemberImageConfig; description?: string;
	devMode?: boolean; liveConfig?: ProfileConfig; onConfigChange?: (cfg: ProfileConfig) => void;
};

export const Profile: React.FC<ProfileProps> = ({
	name, role, level, image, imageConfig, description, devMode = false, liveConfig, onConfigChange,
}) => {
	const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

	const [dragPos, setDragPos] = useState(() => {
		const cfg = devMode ? (liveConfig ?? imageConfig) : null;
		return {
			x: parseFloat((cfg?.objectPosition ?? "center 28%").split(" ")[0]?.replace("%", "")) || 50,
			y: parseFloat((cfg?.objectPosition ?? "center 28%").split(" ")[1]?.replace("%", "")) || 28,
		};
	});
	const [dragScale, setDragScale] = useState(() => (devMode ? (liveConfig?.scale ?? imageConfig?.scale ?? 1) : 1));

	useEffect(() => {
		if (devMode && liveConfig) {
			const newX = parseFloat((liveConfig.objectPosition ?? "center 28%").split(" ")[0]?.replace("%", "")) || 50;
			const newY = parseFloat((liveConfig.objectPosition ?? "center 28%").split(" ")[1]?.replace("%", "")) || 28;
			const newScale = liveConfig.scale ?? 1;
			if (newX !== dragPos.x || newY !== dragPos.y || newScale !== dragScale) {
				setDragPos({ x: newX, y: newY });
				setDragScale(newScale);
			}
		} else if (devMode && imageConfig?.objectPosition) {
			const parts = imageConfig.objectPosition.split(" ");
			const newX = parseFloat(parts[0]?.replace("%", "")) || 50;
			const newY = parseFloat(parts[1]?.replace("%", "")) || 28;
			const newScale = imageConfig.scale ?? 1;
			if (newX !== dragPos.x || newY !== dragPos.y || newScale !== dragScale) {
				setDragPos({ x: newX, y: newY });
				setDragScale(newScale);
			}
		}
	}, [devMode, liveConfig, imageConfig]);

	const syncConfig = () => {
		if (devMode && onConfigChange) {
			const newPos = `${Math.round(dragPos.x)}% ${Math.round(dragPos.y)}%`;
			const newScale = dragScale;
			onConfigChange({
				fit: liveConfig?.fit ?? imageConfig?.fit ?? "cover",
				objectPosition: newPos,
				scale: newScale,
			});
		}
	};

	const resolvedPos = devMode ? `${Math.round(dragPos.x)}% ${Math.round(dragPos.y)}%` : (liveConfig?.objectPosition ?? imageConfig?.objectPosition ?? "center 28%");
	const currentScale = devMode ? dragScale : (liveConfig?.scale ?? imageConfig?.scale ?? 1);

	const handleDrag = useCallback((e: React.MouseEvent) => {
		if (!devMode) return;
		e.preventDefault(); e.stopPropagation();
		const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
		const startX = e.clientX - rect.left; const startY = e.clientY - rect.top;
		const onMove = (ev: MouseEvent) => {
			const dx = ev.clientX - rect.left - startX; const dy = ev.clientY - rect.top - startY;
			const newX = Math.min(Math.max(0, (startX + dx) / rect.width * 100), 100);
			const newY = Math.min(Math.max(0, (startY + dy) / rect.height * 100), 100);
			setDragPos({ x: newX, y: newY });
		};
		const onUp = () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			syncConfig();
		};
		window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
	}, [devMode]);

	const handleWheel = useCallback((e: React.WheelEvent) => {
		if (!devMode) return; e.preventDefault(); e.stopPropagation();
		setDragScale((prev) => { const delta = e.deltaY > 0 ? -0.05 : 0.05; const next = Math.max(0.3, Math.min(3, prev + delta)); return next; });
		syncConfig();
	}, [devMode]);

	const showImage = Boolean(image) && imageConfig?.enabled !== false;
	const imageStyle: React.CSSProperties = { objectFit: imageConfig?.fit ?? "cover", objectPosition: resolvedPos };
	if (currentScale > 0) { imageStyle.transform = `scale(${currentScale})`; imageStyle.transformOrigin = resolvedPos; }

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-xl border border-overlay0/80 bg-mantle/35 transition-colors hover:border-overlay2">
			{showImage && image ? (
				<div className={`relative overflow-hidden bg-surface0/40 ${devMode ? "cursor-grab active:cursor-grabbing" : ""}`} onMouseDown={handleDrag} onWheel={handleWheel}>
					<img src={image} alt={name} className="h-52 w-full select-none" style={imageStyle} />
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-base/45 via-transparent to-transparent" />
					{devMode && (
						<div className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white backdrop-blur-sm">
							{Math.round(dragPos.x)}% {Math.round(dragPos.y)}% · scale {parseFloat(currentScale.toFixed(2))}
						</div>
					)}
				</div>
			) : (
				<div className="flex h-52 w-full items-center justify-center bg-surface0/40">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface1/70 text-lg font-semibold text-subtext1">{initials}</div>
				</div>
			)}
			<div className="flex flex-1 flex-col gap-3 p-5">
				<h2 className="text-xl leading-tight">{name}</h2>
				<div className="flex flex-wrap items-center gap-2">
					<span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles[role].text} ${roleStyles[role].bg} ${roleStyles[role].border}`}>{roleMeta[role].label}</span>
					{level ? <span className="inline-flex w-fit rounded-full border border-overlay1 bg-surface0/60 px-2.5 py-1 text-xs font-medium text-subtext0">{memberLevelMeta[level].label}</span> : null}
				</div>
				{description ? <p className="text-sm leading-relaxed text-subtext0 sm:text-base">{description}</p> : null}
			</div>
		</div>
	);
};

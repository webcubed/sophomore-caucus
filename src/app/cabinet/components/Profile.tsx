import type { MemberImageConfig, MemberLevel, Roles } from "@/lib/members";
import { memberLevelMeta, roleMeta, roleStyles } from "@/lib/members";
import React, { useCallback, useEffect, useRef, useState } from "react";

type ProfileConfig = { fit?: string; objectPosition: string };

type ProfileProps = {
	name: string;
	role: Roles;
	level?: MemberLevel;
	image?: string;
	imageConfig?: MemberImageConfig;
	description?: string;
	devMode?: boolean;
	liveConfig?: ProfileConfig;
	onConfigChange?: (cfg: ProfileConfig) => void;
};

export const Profile: React.FC<ProfileProps> = ({
	name,
	role,
	level,
	image,
	imageConfig,
	description,
	devMode = false,
	liveConfig,
	onConfigChange,
}) => {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("");

	const initialPos = (() => {
		if (!devMode) return null;
		const cfg = liveConfig ?? imageConfig;
		const parts = (cfg?.objectPosition ?? "center 28%").split(" ");
		return { x: parseFloat(parts[0]?.replace("%", "")) || 50, y: parseFloat(parts[1]?.replace("%", "")) || 28 };
	})();

	const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(initialPos);
	const dragPosRef = useRef(dragPos);

	useEffect(() => { dragPosRef.current = dragPos; }, [dragPos]);

	const resolvedPos = devMode && dragPos
		? `${Math.round(dragPos.x)}% ${Math.round(dragPos.y)}%`
		: liveConfig?.objectPosition ?? imageConfig?.objectPosition ?? "center 28%";

	const handleDragStart = useCallback((e: React.MouseEvent) => {
		if (!devMode) return;
		e.preventDefault();
		e.stopPropagation();
		const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
		const startY = e.clientY - rect.top;

		const onMove = (ev: MouseEvent) => {
			const newY = Math.min(
				Math.max(0, ((ev.clientY - rect.top - startY) / rect.height) * 100),
				100
			);
			const pos = { x: dragPosRef.current!.x, y: newY };
			dragPosRef.current = pos;
			setDragPos(pos);
		};

		const onUp = () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
			if (onConfigChange && dragPosRef.current) {
				onConfigChange({
					fit: liveConfig?.fit ?? imageConfig?.fit ?? "cover",
					objectPosition: `${Math.round(dragPosRef.current.x)}% ${Math.round(dragPosRef.current.y)}%`,
				});
			}
		};

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
	}, [devMode, liveConfig, imageConfig, onConfigChange]);

	const showImage = Boolean(image) && imageConfig?.enabled !== false;
	const imageStyle: React.CSSProperties = {
		objectFit: imageConfig?.fit ?? "cover",
		objectPosition: resolvedPos,
	};

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-xl border border-overlay0/80 bg-mantle/35 transition-colors hover:border-overlay2">
			{showImage && image ? (
				<div
					className={`relative overflow-hidden bg-surface0/40 ${devMode ? "cursor-grab active:cursor-grabbing" : ""}`}
					onMouseDown={handleDragStart}
				>
					<img src={image} alt={name} className="h-52 w-full select-none" style={imageStyle} />
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-base/45 via-transparent to-transparent" />
					{devMode && dragPos && (
						<div className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white backdrop-blur-sm">
							{Math.round(dragPos.y)}%
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

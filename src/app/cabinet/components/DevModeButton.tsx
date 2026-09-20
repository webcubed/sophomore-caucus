"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Copy, Bug } from "lucide-react";
import { memberDirectory } from "@/lib/members";

export function DevModeButton({
	devMode,
	onToggle,
}: {
	devMode: boolean;
	onToggle: () => void;
}) {
	const searchParams = useSearchParams();
	const [copiedAll, setCopiedAll] = useState(false);

	const shouldShowDev =
		process.env.NODE_ENV === "development" &&
		searchParams?.get("dev") === "true";

	const handleCopyAll = useCallback(() => {
		const membersWithImages = memberDirectory.filter(
			(m) => m.image && m.imageConfig?.enabled !== false
		);
		const blocks = membersWithImages.map((m) => {
			const cfg =
				m.imageConfig ?? { fit: "cover", objectPosition: "center 28%" };
			return `// ${m.name}\nimage: "${m.image}",\nimageConfig: {\n  fit: "${cfg.fit ?? "cover"}",\n  objectPosition: "${cfg.objectPosition ?? "center 28%"}",\n}`;
		});
		navigator.clipboard?.writeText(blocks.join("\n\n"));
		setCopiedAll(true);
		setTimeout(() => setCopiedAll(false), 2000);
	}, []);

	if (!shouldShowDev) return null;

	return (
		<div className="mb-4 flex items-center gap-3">
			<button
				type="button"
				onClick={onToggle}
				className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${devMode ? "bg-green/20 text-green" : "bg-surface1 text-subtext1 hover:text-text"}`}
			>
				<Bug className="h-4 w-4" />
				Dev Mode {devMode ? "ON" : "OFF"}
			</button>
			{devMode && (
				<>
					<button
						type="button"
						onClick={handleCopyAll}
						className="rounded cursor-pointer bg-green px-4 py-2 text-sm font-medium text-white shadow hover:bg-green/90"
					>
						{copiedAll ? "Copied all!" : "Copy all configs"}
					</button>
					<span className="text-xs text-subtext0">
						Drag each image to edit · Click to view contact info
					</span>
				</>
			)}
		</div>
	);
}

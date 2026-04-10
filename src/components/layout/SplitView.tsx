import { useState, useCallback, useRef, type ReactNode } from "react";
import {
	clampSplitPercentage,
	DEFAULT_SPLIT_PERCENTAGE,
	toSplitPercentage,
} from "./split-view-utils";

interface SplitViewProps {
	first: ReactNode;
	second: ReactNode;
	direction: "horizontal" | "vertical";
}

export function SplitView({ first, second, direction }: SplitViewProps) {
	const [split, setSplit] = useState(DEFAULT_SPLIT_PERCENTAGE);
	const containerRef = useRef<HTMLDivElement>(null);
	const isVertical = direction === "vertical";

	const handleMouseDown = useCallback(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const pct = toSplitPercentage(direction, rect, e);
			setSplit(clampSplitPercentage(pct));
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
		document.body.style.userSelect = "none";
	}, [direction, isVertical]);

	return (
		<div ref={containerRef} className={`flex h-full ${isVertical ? "flex-col" : "flex-row"}`}>
			<div
				style={isVertical ? { height: `${split}%` } : { width: `${split}%` }}
				className="overflow-hidden p-4"
			>
				{first}
			</div>
			<div
				onMouseDown={handleMouseDown}
				className={
					isVertical
						? "h-1 cursor-row-resize bg-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--ring))]"
						: "w-1 cursor-col-resize bg-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--ring))]"
				}
			/>
			<div
				style={isVertical ? { height: `${100 - split}%` } : { width: `${100 - split}%` }}
				className="overflow-hidden p-4"
			>
				{second}
			</div>
		</div>
	);
}

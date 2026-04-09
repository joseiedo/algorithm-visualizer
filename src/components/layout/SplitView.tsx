import { useState, useCallback, useRef, type ReactNode } from "react";

interface SplitViewProps {
	top: ReactNode;
	bottom: ReactNode;
}

export function SplitView({ top, bottom }: SplitViewProps) {
	const [topHeight, setTopHeight] = useState(55);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = useCallback(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const pct = ((e.clientY - rect.top) / rect.height) * 100;
			setTopHeight(Math.min(80, Math.max(20, pct)));
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		document.body.style.cursor = "row-resize";
		document.body.style.userSelect = "none";
	}, []);

	return (
		<div ref={containerRef} className="flex h-full flex-col">
			<div style={{ height: `${topHeight}%` }} className="w-full overflow-hidden p-4">
				{top}
			</div>
			<div
				onMouseDown={handleMouseDown}
				className="h-1 cursor-row-resize bg-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--ring))]"
			/>
			<div style={{ height: `${100 - topHeight}%` }} className="w-full overflow-hidden p-4">
				{bottom}
			</div>
		</div>
	);
}

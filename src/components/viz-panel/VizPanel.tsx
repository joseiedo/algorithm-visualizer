import { SortingRenderer } from "./SortingRenderer";
import type { SortingState } from "@/algorithms/types";

interface VizPanelProps {
	state: SortingState | null;
	renderer: "sorting";
}

export function VizPanel({ state, renderer }: VizPanelProps) {
	if (!state) return null;

	if (renderer === "sorting") {
		return <SortingRenderer state={state} />;
	}

	return null;
}

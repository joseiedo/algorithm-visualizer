import type {
	AlgorithmRenderer,
	BezierState,
	SortingState,
	VisualizationState,
} from "@/algorithms/types";
import { BezierRenderer } from "./BezierRenderer";
import { SortingRenderer } from "./SortingRenderer";

interface VizPanelProps {
	state: VisualizationState | null;
	renderer: AlgorithmRenderer;
}

export function VizPanel({ state, renderer }: VizPanelProps) {
	if (!state) return null;

	if (renderer === "sorting") {
		return <SortingRenderer state={state as SortingState} />;
	}

	if (renderer === "bezier") {
		return <BezierRenderer state={state as BezierState} />;
	}

	return null;
}

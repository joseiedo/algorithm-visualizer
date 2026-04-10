import { SortingRenderer } from "./SortingRenderer";
import type { AlgorithmRenderer, BaseState, SortingState } from "@/algorithms/types";

interface VizPanelProps {
  state: BaseState | null;
  renderer: AlgorithmRenderer;
}

export function VizPanel({ state, renderer }: VizPanelProps) {
  if (!state) return null;

  if (renderer === "sorting") {
    return <SortingRenderer state={state as SortingState} />;
  }

  return null;
}

import { SortingRenderer } from "./SortingRenderer";
import type { BaseState, SortingState } from "@/algorithms/types";

interface VizPanelProps {
  state: BaseState | null;
  renderer: string;
}

export function VizPanel({ state, renderer }: VizPanelProps) {
  if (!state) return null;

  if (renderer === "sorting") {
    return <SortingRenderer state={state as SortingState} />;
  }

  return null;
}

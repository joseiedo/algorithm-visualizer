import type { AlgorithmDefinition, BaseState } from "./types";
import { bubbleSort } from "./sorting/bubble-sort";

export const algorithms: AlgorithmDefinition<BaseState>[] = [
	bubbleSort as AlgorithmDefinition<BaseState>,
];

export function getAlgorithm(id: string) {
	return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: string) {
	return algorithms.filter((a) => a.category === category);
}

import type { AlgorithmCategory, AlgorithmDefinition } from "./types";
import { bubbleSort } from "./sorting/bubble-sort";

export const algorithms: AlgorithmDefinition[] = [
	bubbleSort,
];

export function getAlgorithm(id: string) {
	return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory) {
	return algorithms.filter((a) => a.category === category);
}

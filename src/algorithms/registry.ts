import type { AlgorithmCategory, AlgorithmDefinition } from "./types";
import { quadraticBezier } from "./curves/quadratic-bezier";
import { bubbleSort } from "./sorting/bubble-sort";
import { quickSort } from "./sorting/quick-sort";

export const algorithms = [
	bubbleSort,
	quickSort,
	quadraticBezier,
] as const satisfies readonly AlgorithmDefinition[];

export function getAlgorithm(id: string) {
	return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory) {
	return algorithms.filter((a) => a.category === category);
}

import { algorithms, getAlgorithm } from "@/algorithms/registry";

export type LayoutDirection = "horizontal" | "vertical";

export function resolveAlgorithmView(id?: string) {
	if (!id) {
		return {
			algorithm: algorithms[0],
			shouldRedirect: false,
		};
	}

	const algorithm = getAlgorithm(id);

	if (!algorithm) {
		return {
			algorithm: algorithms[0],
			shouldRedirect: true,
		};
	}

	return {
		algorithm,
		shouldRedirect: false,
	};
}

export function toggleLayoutDirection(direction: LayoutDirection): LayoutDirection {
	return direction === "vertical" ? "horizontal" : "vertical";
}

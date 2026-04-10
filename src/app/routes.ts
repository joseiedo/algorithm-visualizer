export const DEFAULT_ALGORITHM_ROUTE = "/sorting/bubble-sort";

export function getAlgorithmRoute(category: string, id: string) {
	return `/${category}/${id}`;
}
